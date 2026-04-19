import Typography from "@mui/material/Typography";
import Link from "@fuse/core/Link";

function SignInPageTitle() {
  return (
    <div className="w-full">
      <div className="flex items-center gap-4 mb-12">
        <img
          className="w-24 h-auto ml-[-22px]"
          src="/assets/images/logo/logo.svg"
          alt="G&M Logo"
          style={{
            transform: "rotate(-8deg) translateY(-4px)",
            filter: "drop-shadow(0px 2px 3px rgba(0,0,0,0.1))",
          }}
        />
        <div className="flex flex-col border-l border-gray-200 pl-5">
          <Typography className="text-2xl font-bold leading-none tracking-tight text-slate-900 uppercase">
            G&M SEGUROS S.A.
          </Typography>
          <Typography className="text-sm font-medium opacity-60 mt-1">
            Asesores de tu presente y futuro
          </Typography>
        </div>
      </div>

      <Typography className="text-4xl leading-[1.25] font-extrabold tracking-tight">
        Inici&aacute; Sesi&oacute;n
      </Typography>

      <div className="mt-2 flex items-baseline font-medium">
        <Typography className="text-gray-500 text-sm">
          &iquest;No tienes una cuenta?
        </Typography>
        <Link
          className="ml-1 text-sm font-semibold"
          to="/sign-up"
          color="primary"
        >
          Reg&iacute;strate
        </Link>
      </div>
    </div>
  );
}

export default SignInPageTitle;
