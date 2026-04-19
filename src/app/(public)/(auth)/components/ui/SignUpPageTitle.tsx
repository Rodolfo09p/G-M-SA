import Typography from "@mui/material/Typography";
import Link from "@fuse/core/Link";

function SignUpPageTitle() {
  return (
    <div className="w-full">
      <div className="flex items-center gap-4">
        <img
          className="w-24 h-auto"
          src="/assets/images/logo/logo.svg"
          alt="G&M Logo"
          style={{
            transform: "rotate(-8deg) translateY(-4px)",
            filter: "drop-shadow(0px 2px 3px rgba(0,0,0,0.1))",
          }}
        />
        <div className="flex flex-col border-l border-gray-200 pl-5">
          <Typography className="text-2xl font-bold leading-none tracking-tight text-gray-800 uppercase">
            G&M SEGUROS S.A.
          </Typography>
          <Typography className="text-sm font-medium opacity-60 mt-1">
            Asesores de tu presente y futuro
          </Typography>
        </div>
      </div>

      <Typography className="mt-10 text-4xl leading-[1.25] font-extrabold tracking-tight">
        Reg&iacute;strate
      </Typography>

      <div className="mt-1 flex items-baseline font-medium">
        <Typography className="text-gray-500 text-sm">
          &iquest;Ya tienes una cuenta?
        </Typography>
        <Link className="ml-2 text-sm font-bold" to="/sign-in" color="primary">
          Inici&aacute; Sesi&oacute;n
        </Link>
      </div>
    </div>
  );
}

export default SignUpPageTitle;
