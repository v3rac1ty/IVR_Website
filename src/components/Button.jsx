import clsx from "clsx";

// Renders an <a> when given an href (external links open in a new tab), otherwise a <button>.
const Button = ({ id, title, rightIcon, leftIcon, containerClass, href, variant = "accent", ...props }) => {
  const className = clsx(
    "group relative z-10 inline-flex w-fit cursor-pointer items-center justify-center gap-1.5 overflow-hidden rounded-full px-7 py-3 text-xs font-bold uppercase tracking-wide transition-transform duration-200 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60",
    variant === "accent" && "bg-accent text-ink hover:bg-accent-hover",
    variant === "light" && "bg-paper text-ink hover:bg-white",
    containerClass
  );

  const content = (
    <>
      {leftIcon}
      <span className="relative inline-flex overflow-hidden">
        <span className="translate-y-0 skew-y-0 transition duration-500 group-hover:translate-y-[-160%] group-hover:skew-y-12">
          {title}
        </span>
        <span
          aria-hidden="true"
          className="absolute translate-y-[164%] skew-y-12 transition duration-500 group-hover:translate-y-0 group-hover:skew-y-0"
        >
          {title}
        </span>
      </span>
      {rightIcon}
    </>
  );

  if (href) {
    const external = /^https?:/.test(href);
    return (
      <a
        id={id}
        href={href}
        className={className}
        {...(external && { target: "_blank", rel: "noopener noreferrer" })}
        {...props}
      >
        {content}
      </a>
    );
  }

  return (
    <button id={id} type="button" className={className} {...props}>
      {content}
    </button>
  );
};

export default Button;
