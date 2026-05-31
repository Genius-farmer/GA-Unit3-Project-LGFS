export const iconEditSrc = "/images/FeEdit.svg";
export const iconAddSrc = "/images/IcRoundAdd.svg";
export const iconCloseSrc = "/images/IcRoundClose.svg";
export const iconDeleteSrc = "/images/TablerTrash.svg";
export const iconLogoutSrc = "/images/IcRoundLogout.svg";
export const navLogoSrc = "/images/nav-logo.png";
export const defaultProfileSrc = "/images/default-profile-portrait.png";

export const getAsset = (src) => {
  return new URL("../assets" + src, import.meta.url).href;
};
