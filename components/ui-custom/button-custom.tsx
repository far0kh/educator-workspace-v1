import ButtonSvg from "./button-custom/button-svg";

type ButtonProps = {
  className?: string;
  href?: string;
  onClick?: () => void;
  children: React.ReactNode;
  px?: string;
  white?: boolean;
  violet?: boolean;
  disabled?: boolean;
};

const ButtonCustom: React.FC<ButtonProps> = ({ className, href, onClick, children, px, white, violet, disabled }) => {
  const classes = `button relative inline-flex items-center justify-center h-11 transition-colors ${px || "px-7"
    } ${white ? "text-n-8" : ""} ${violet ? "text-n-1" : ""} ${className || ""}`;
  const spanClasses = "relative group flex items-center justify-center whitespace-nowrap z-10";

  const renderButton = () => (
    <button className={classes} onClick={onClick} disabled={disabled}>
      <span className={spanClasses}>{children}</span>
      {ButtonSvg(white, violet)}
    </button>
  );

  const renderLink = () => (
    <a href={href} className={classes}>
      <span className={spanClasses}>{children}</span>
      {ButtonSvg(white, violet)}
    </a>
  );

  return href ? renderLink() : renderButton();
};

export default ButtonCustom;
