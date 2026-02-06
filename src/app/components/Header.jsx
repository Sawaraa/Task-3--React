import React, {useEffect, useMemo, useRef, useState} from 'react';
import { createUseStyles } from 'react-jss';
import { useIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import Button from 'components/Button';
import Hover from 'components/Hover';
import IconButton from 'components/IconButton';
import IconGlobus from 'components/icons/Globus';
import Link from 'components/Link';
import Logo from 'components/Logo';
import Menu from 'components/Menu';
import MenuItem from 'components/MenuItem';
import Typography from 'components/Typography';
import useChangePage from 'misc/hooks/useChangePage';
import useCurrentPage from 'misc/hooks/useCurrentPage';
import useIsMobile from 'misc/hooks/useIsMobile';
import useLocationSearch from 'misc/hooks/useLocationSearch';
import useTheme from 'misc/hooks/useTheme';

import * as pages from 'constants/pages';
import languages from 'misc/constants/languages';
import pagesURLs from 'constants/pagesURLs';

import LeftNavBar from './LeftNavBar';

const getClasses = createUseStyles((theme) => ({
  container: {
    color: theme.header.color.text.primary,
    background: theme.header.color.background,
    boxShadow: '0px 0px 6px 0px',
    display: 'flex',
    height: `${theme.header.height}px`,
    zIndex: 1300,
  },
  content: {
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'space-between',
    padding: `${theme.spacing(1)}px ${theme.spacing(2)}px`,
    width: '100%',
  },
  hover: {
    padding: `${theme.spacing(0.5)}px ${theme.spacing(1)}px`,
  },
  selectedLang: {
    display: 'flex',
    width: 'fit-content',
  },
  toolBarContainerLeft: {
    alignItems: 'center',
    display: 'flex',
    gap: `${theme.spacing(1)}px`,
  },
  toolBarContainerRight: {
    alignItems: 'center',
    display: 'flex',
    gap: `${theme.spacing(1)}px`,
    justifyContent: 'flex-end',
  },
  userNameMobile: {
    maxWidth: '110px',
  },
  //my style
  bookLink: {
    fontSize: '1.5rem',
    fontWeight: 600,
    fontFamily: "inherit",
    textDecoration: 'none',
    color: '#16bb00',
    display: 'flex',
    alignItems: 'center',
    padding: `${theme.spacing(1)}px ${theme.spacing(2)}px`,
    borderRadius: '8px',
        transition: 'background-color 0.2s ease',
    '&:hover': {
      backgroundColor: 'rgba(0, 0, 0, 0.08)',
      cursor: 'pointer',
    },
  },

}));

const interfaceLagsTranslate = {
  [languages.en]: 'English',
  [languages.ua]: 'Українська',
};

const interfaceLagsTranslateShort = {
  [languages.en]: 'Eng',
  [languages.ua]: 'Укр',
};

const orderedInterfaceLangs = [
  languages.ua,
  languages.en,
];

const rightPanelItemTypes = {
  LANGUAGE: 'language',
  LOGIN: 'login',
  SEPARATOR: 'separator',
  USER_NAME: 'userName',
};

function Header({
  onLogout,
}) {
  const { theme } = useTheme();
  const { formatMessage } = useIntl();
  const changePage = useChangePage();
  const classes = getClasses({ theme });
  const currentPage = useCurrentPage();
  const isMobile = useIsMobile();
  const langsMenuRef = useRef(null);
  const locationSearch = useLocationSearch();
  const user = useSelector(({ user: reducerUser }) => reducerUser);
  const userMenuRef = useRef(null);

  const [state, setState] = useState({
    isLangsMenuOpened: false,
    isUserMenuOpened: false,
  });

  const [externalUser, setExternalUser] = useState(null);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/profile`, {
      credentials: 'include'
    })
        .then(res => {
          if (res.ok) return res.json();
          throw new Error('Not logged in');
        })
        .then(data => {
          console.log("Profile data received:", data); // Подивись у консоль!
          if (data && data.username) {
            setExternalUser(data.username); // Зберігаємо саме рядок з іменем
          }
        })
        .catch(() => {
          setExternalUser(null);
        });
  }, []);

  // Використовуємо displayUserName для відображення
  const displayUserName = externalUser || user.firstName || user.login || "User";


  const actualOrderedRightPanelItemTypes = useMemo(() => {
    const result = [];

    // Якщо externalUser має значення (не null), то ми авторизовані
    if (externalUser || user.isAuthorized) {
      result.push(rightPanelItemTypes.USER_NAME);
    } else {
      result.push(rightPanelItemTypes.LOGIN);
    }

    result.push(rightPanelItemTypes.LANGUAGE);

    return result.reduce((acc, item, index) => {
      if (index > 0) acc.push(rightPanelItemTypes.SEPARATOR);
      acc.push(item);
      return acc;
    }, []);
  }, [externalUser, user.isAuthorized]);

  return (
    <div className={classes.container}>
      <div className={classes.content}>
        <div className={classes.toolBarContainerLeft}>
          <LeftNavBar />
          <Link
            to={{
              pathname: `${pagesURLs[pages.defaultPage]}`,
            }}
          >
            <Hover
              light
              selected={currentPage === pages.defaultPage}
            >
              <div className={classes.hover}>
                <Logo compact={isMobile} />
              </div>
            </Hover>
          </Link>
        </div>
        <div className={classes.toolBarContainerRight}>
          {actualOrderedRightPanelItemTypes.map((itemType) => (
            <>
              {itemType === rightPanelItemTypes.USER_NAME && (
                <div ref={userMenuRef}>
                  <Hover
                    light
                    onClick={() => setState({
                      ...state,
                      isUserMenuOpened: true,
                    })}
                    selected={state.isUserMenuOpened}
                  >
                    <div className={classes.hover}>
                      <div
                        className={isMobile ? classes.userNameMobile : ''}
                      >
                        <Typography
                          color="paper"
                          noWrap
                          variant="subtitle"
                        >
                          {!isMobile
                            ? (
                              <strong>
                                {displayUserName}
                              </strong>
                            )
                            : displayUserName
                          }
                        </Typography>
                      </div>
                    </div>
                  </Hover>
                </div>
              )}
              {itemType === rightPanelItemTypes.LOGIN && (
                  <a
                      href={`${process.env.REACT_APP_API_URL}/oauth2/authorization/google`}
                      style={{ textDecoration: 'none' }}
                  >
                  <Button
                    colorVariant="header"
                    variant="text"
                  >
                    <Typography
                      color="inherit"
                      variant="subtitle"
                    >
                      <strong>
                        {formatMessage({ id: 'signIn' })}
                      </strong>
                    </Typography>
                  </Button>
                  </a>
              )}
              {itemType === rightPanelItemTypes.LANGUAGE && (
                <>
                  <div className={classes.selectedLang}>
                    <Typography
                      color="paper"
                      noWrap
                    >
                      {(isMobile
                        ? interfaceLagsTranslateShort
                        : interfaceLagsTranslate
                      )[locationSearch.lang]}
                    </Typography>
                  </div>
                  <div ref={langsMenuRef}>
                    <IconButton
                      colorVariant="header"
                      onClick={() => setState({
                        ...state,
                        isLangsMenuOpened: true,
                      })}
                    >
                      <IconGlobus
                        color="header"
                        size={32}
                      />
                    </IconButton>
                  </div>
                </>
              )}
              {itemType === rightPanelItemTypes.SEPARATOR && (
                <Typography
                  color="paper"
                  variant="subtitle"
                >
                  <strong>
                    |
                  </strong>
                </Typography>
              )}
            </>
          ))}
        </div>
        <Menu
          anchorEl={langsMenuRef.current}
          colorVariant="header"
          open={state.isLangsMenuOpened}
          onClose={() => setState({
            ...state,
            isLangsMenuOpened: false,
          })}
        >
          {orderedInterfaceLangs.map(lang => (
            <MenuItem
              onClick={() => {
                changePage({
                  locationSearch: {
                    ...locationSearch,
                    lang,
                  },
                  replace: true,
                });
                setState({
                  ...state,
                  isLangsMenuOpened: false,
                });
              }}
              selected={locationSearch.lang === lang}
            >
              <Typography>
                {interfaceLagsTranslate[lang]}
              </Typography>
            </MenuItem>
          ))}
        </Menu>
        <Menu
          anchorEl={userMenuRef.current}
          open={state.isUserMenuOpened}
          onClose={() => setState({
            ...state,
            isUserMenuOpened: false,
          })}
        >
          <MenuItem
            onClick={() => {
              setState({
                ...state,
                isUserMenuOpened: false,
              });
              onLogout();
            }}
          >
            <Typography>
              {formatMessage({ id: 'signOut' })}
            </Typography>
          </MenuItem>
        </Menu>
      </div>
    </div>
  );
}

export default Header;
