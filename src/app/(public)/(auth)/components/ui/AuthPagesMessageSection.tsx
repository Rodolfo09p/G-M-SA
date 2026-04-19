import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

function AuthPagesMessageSection() {
  return (
    <Box
      className="relative hidden h-full flex-auto items-center justify-center overflow-hidden p-16 md:flex lg:px-28"
      sx={{
        backgroundColor: "#0a2540",
        color: "primary.contrastText",
      }}
    >
   

      <div className="relative z-10 w-full max-w-2xl flex flex-col items-center text-center">
       
        <img
          className="w-48 h-auto mb-6"
          src="/assets/images/logo/logo.svg"
          alt="G&M Logo"
          style={{ filter: "brightness(0) invert(1)" }}
        />

      
        <Typography className="text-5xl font-bold tracking-tight text-white mb-2">
          G&M SEGUROS S.A.
        </Typography>

        <Typography className="text-xl font-light opacity-80 mb-8 italic">
          Asesores de tu presente y futuro
        </Typography>

  
        <div className="flex flex-col items-center mb-12">
          <Typography
            className="text-6xl font-serif font-bold"
            sx={{
              background:
                "linear-gradient(to bottom, #f9df7b 0%, #d4af37 50%, #b38728 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
            }}
          >
            14
          </Typography>
          <Typography className="text-2xl tracking-[0.2em] uppercase text-[#d4af37] font-semibold">
            Aniversario
          </Typography>
        </div>

   
        <div className="border-t border-white/20 pt-8 w-full">
          <Typography className="text-3xl font-light tracking-wide text-gray-300">
            Gestión de{" "}
            <span className="font-semibold text-white">
              Correduría de Seguros
            </span>
          </Typography>

          <p className="mt-4 text-lg text-gray-400 font-light">
            Plataforma centralizada para el control de pólizas, conciliación de
            morosidad y digitalización de expedientes.
          </p>
        </div>
      </div>
    </Box>
  );
}

export default AuthPagesMessageSection;
