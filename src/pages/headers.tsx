import { useEffect, useState } from "react";
import { Col, Container, Nav, NavDropdown, Navbar, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import { selectTheme, switchTheme } from "../store/features/themeSlice";
import { AuthButton } from "./dex/components/AuthButton";
import LanguageMenu from "./dex/components/LanguageMenu";

export function DefaultHeader() {
  const { t } = useTranslation();

  const dispatch = useDispatch();
  const theme = useSelector(selectTheme);

  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const ref = searchParams.get("ref");

  const [expanded, setExpanded] = useState<boolean>(false);

  useEffect(() => {
    if (theme === "dark-mode") {
      document.body.classList.remove("light-mode");
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
      document.body.classList.add("light-mode");
    }
  }, [theme]);

  return (
    <>
      <header className="header border-bottom mb-4 mb-lg-5">
        <Navbar
          expand="lg"
          expanded={expanded}
          onToggle={() => {
            setExpanded(!expanded);
          }}
        >
          <Container fluid className="px-auto px-xl-5">
            <Link to="/" className="header__logo">
              <img
                src="https://i.ibb.co/JK1c6s3/Add-a-heading-5-removebg-preview.png"
                alt=""
                className="header__logo-img"
              />
            </Link>
            <div className="d-block d-lg-none ms-auto me-4">
              <Nav.Item>
                <AuthButton isMobile={true} />
              </Nav.Item>
            </div>
            {/* Toggle Button */}
            <Navbar.Toggle
              data-bs-target="#navbarDexContent"
              data-bs-toggle="collapse"
              className="btn-toggler"
            >
              <span />
              <span />
              <span />
            </Navbar.Toggle>

            {/* Navigation Links */}
            <Navbar.Collapse id="navbarDexContent">
              <div className="d-flex flex-column flex-lg-row w-100">
              <Nav className="d-block d-lg-flex align-items-center order-2 order-lg-1 me-auto ">
                  <Nav.Item>
                    <Link
                      className={`nav-link text-nowrap ${
                        location.pathname === "/swap" ? "active-link" : ""
                      }`}
                      to="/swap"
                      onClick={() => setExpanded(false)}
                    >
                            {' '}
                            {' '}

                    </Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Link
                      className={`nav-link text-nowrap ${
                        location.pathname.slice(0, 10) === "/liquidity"
                          ? "active-link"
                          : ""
                      }`}
                      to="/liquidity"
                      onClick={() => setExpanded(false)}
                    >
                                  {"\t"} {"\t"} {"\t"}


                    </Link>
                  </Nav.Item>
                
                  
                
                     </Nav>

                <Nav className="d-block d-lg-flex align-items-center order-2 order-lg-1 me-auto ">
                  <Nav.Item>
                    <Link
                      className={`nav-link text-nowrap ${
                        location.pathname === "/swap" ? "active-link" : ""
                      }`}
                      to="/swap"
                      onClick={() => setExpanded(false)}
                    >
                      {t("navigation.exchange.exchange")}
                    </Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Link
                      className={`nav-link text-nowrap ${
                        location.pathname.slice(0, 10) === "/liquidity"
                          ? "active-link"
                          : ""
                      }`}
                      to="/liquidity"
                      onClick={() => setExpanded(false)}
                    >
                      {t("navigation.liquidity.liquidity")}
                    </Link>
                  </Nav.Item>
                   
                  <Nav.Item>
        <a
          className="nav-link text-nowrap"
          href="http://localhost:8000/docs#/"
          target="_blank"
          rel="noopener noreferrer"
        >
          API
        </a>
      </Nav.Item>
                  
                
                     </Nav>

                <Nav className="d-block d-lg-flex align-items-center align-items-lg-center border-top-mobile order-3 ms-0 ms-lg-2">
                  <LanguageMenu setExpanded={setExpanded} />
                  <Nav.Item className="me-0 me-lg-2">
                    <Nav.Link
                      className="btn btn-sm btn-link bg-transparent"
                      href="javascript://"
                      onClick={() => {
                        dispatch(switchTheme());
                      }}
                    >
                      <div className="dark-mode-icon w-100">
                        <div className="d-flex align-items-center w-100">
                          <span className="d-inline d-lg-none me-auto">
                            {t("theme.dark")}
                          </span>
                          <i
                            className="fa-solid fa-moon fs-18"
                            style={{
                              transform: "rotate(210deg)",
                            }}
                          />
                        </div>
                      </div>
                      <div className="light-mode-icon w-100">
                        <div className="d-flex align-items-center w-100">
                          <span className="d-inline d-lg-none me-auto">
                            {t("theme.light")}
                          </span>
                          <i className="fa-solid fa-sun-bright fs-18" />
                        </div>
                      </div>
                    </Nav.Link>
                  </Nav.Item>

                  <Nav.Item className="mx-2 mx-lg-0 mt-4 mt-lg-0 d-none d-lg-block">
                    <AuthButton />
                  </Nav.Item>
                </Nav>
              </div>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      </header>
    </>
  );
}
