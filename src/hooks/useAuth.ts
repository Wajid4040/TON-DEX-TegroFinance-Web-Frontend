import {
  useIsConnectionRestored,
  useTonConnectUI,
  useTonWallet,
} from "@tonconnect/ui-react";
import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import {
  useGetPayloadMutation,
  useLoginMutation,
} from "../store/api/authApiSlice";
import { removeToken, updateToken } from "../store/features/authSlice";
import { getCookie, setCookie } from "../utils/cookie";

const TokenCookieKey = import.meta.env.VITE_LOCAL_TOKEN_COOKIE_KEY ?? "";
const REFERRAL_LINK_KEY = "ref";

const getTokenCookie = () => {
  const token = getCookie(TokenCookieKey);
  console.log("Retrieved token cookie:", token); // Log the retrieved token
  return token;
};

const setTokenCookie = (token: string) => {
  console.log("Setting token cookie:", token);
  setCookie(TokenCookieKey, token, { path: '/', expires: 1 }); // Adjust the options as needed
};

export function useAuth() {
  const dispatch = useDispatch();

  const [getPayloadRequest] = useGetPayloadMutation();
  const [loginRequest] = useLoginMutation();

  const isConnectionRestored = useIsConnectionRestored();
  const wallet = useTonWallet();
  const [tonConnectUI] = useTonConnectUI();

  const refreshPayloadInterval = useRef<
    ReturnType<typeof setInterval> | undefined
  >();
  const checkTokenCookieInterval = useRef<
    ReturnType<typeof setInterval> | undefined
  >();

  const refreshPayload = async () => {
    tonConnectUI.setConnectRequestParameters({ state: "loading" });

    try {
      const value = await getPayloadRequest().unwrap();
      console.log("Payload value received, setting state to ready.", value);
      if (!value) {
        tonConnectUI.setConnectRequestParameters({
          state: "loading",
        });
      } else {
        tonConnectUI.setConnectRequestParameters({
          state: "ready",
          value,
        });
      }
    } catch (error) {
      console.error("Error in refreshPayload:", error);
      tonConnectUI.setConnectRequestParameters({ state: "loading" }); // Default to loading state on error
    }
  };

  const removeTokenCookie = () => {
    console.log("Removing token cookie and disconnecting UI.");
    dispatch(removeToken());
    document.cookie = `${TokenCookieKey}=; max-age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT`;
    if (tonConnectUI.connected) {
      tonConnectUI.disconnect();
    }
  };

  const checkTokenCookie = () => {
    const newToken = getTokenCookie();
    console.log("Checking token cookie:", newToken);
    if (newToken) {
      console.log("New token found, updating state.");
      dispatch(updateToken(newToken));
    } else if (tonConnectUI.connected) {
      console.log("No token found, removing token cookie.");
      removeTokenCookie();
    }
  };

  if (!checkTokenCookieInterval.current) {
    checkTokenCookieInterval.current = setInterval(checkTokenCookie, 1000 * 5);
  }

  useEffect(() => {
    const cookieToken = getTokenCookie();
    console.log("Initial cookie token:", cookieToken);

    if (cookieToken) {
      console.log("Cookie token found on initial load, updating state.");
      dispatch(updateToken(cookieToken));
    }

    if (!isConnectionRestored) {
      console.log("Connection not restored, returning early.");
      return;
    }

    if (!wallet) {
      console.log("Wallet not connected. Removing token cookie.");
      removeTokenCookie();

      refreshPayload();
      refreshPayloadInterval.current = setInterval(
        refreshPayload,
        1000 * 60 * 19
      );
      return;
    }

    if (cookieToken) {
      console.log("Cookie token found, returning early.");
      return;
    }

    if (
      wallet.connectItems?.tonProof &&
      !("error" in wallet.connectItems.tonProof)
    ) {
      console.log("Ton proof found, proceeding with login request.");
      loginRequest({
        referral_code: localStorage.getItem(REFERRAL_LINK_KEY) ?? undefined,
        address: wallet.account.address,
        network: Number(wallet.account.chain),
        proof: {
          timestamp: wallet.connectItems.tonProof.proof.timestamp,
          domain: {
            length_bytes: wallet.connectItems.tonProof.proof.domain.lengthBytes,
            value: wallet.connectItems.tonProof.proof.domain.value,
          },
          signature: wallet.connectItems.tonProof.proof.signature,
          payload: wallet.connectItems.tonProof.proof.payload,
          state_init: wallet.account?.walletStateInit,
          public_key: wallet.account?.publicKey,
        },
      })
        .unwrap()
        .then((response) => {
          console.log("Login request successful, setting token cookie.");
          setTokenCookie(response.token); // Assuming response contains the token
          checkTokenCookie();
        })
        .catch(error => {
          console.error("Login request failed:", error);
          removeTokenCookie();
        });
    } else {
      console.log("Ton proof error or missing.");
      removeTokenCookie();
      tonConnectUI.disconnect();
    }
  }, [wallet, isConnectionRestored]);
}
