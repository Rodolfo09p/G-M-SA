import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import clsx from "clsx";

const Root = styled("div")(({ theme }) => ({
  "& > .logo-icon": {
    transition: theme.transitions.create(["width", "height"], {
      duration: theme.transitions.duration.shortest,
      easing: theme.transitions.easing.easeInOut,
    }),
  },
  "& > .badge": {
    transition: theme.transitions.create("opacity", {
      duration: theme.transitions.duration.shortest,
      easing: theme.transitions.easing.easeInOut,
    }),
  },
}));

type LogoProps = {
  className?: string;
};

/**
 * The logo component.
 */
function Logo(props: Readonly<LogoProps>) {
  const { className = "" } = props;
  return (
    <Root
      className={clsx(
        "flex shrink-0 grow items-center gap-3",
        className,
      )}
    >
      <div className="flex flex-1 items-center gap-2">
        <img
          className="logo-icon h-9 w-9 object-contain dark:brightness-0 dark:invert"
          src="/assets/images/logo/logo.svg"
          alt="G&M logo"
        />
        <div className="logo-text flex flex-auto flex-col gap-0.5">
          <Typography className="tracking-light text-lg leading-none font-semibold">
            G&M S.A
          </Typography>
        </div>
      </div>
      {/* <MainProjectSelection /> */}
    </Root>
  );
}

export default Logo;
