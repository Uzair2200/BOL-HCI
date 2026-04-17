import { useNavigate } from "react-router";

export default function Welcome() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F2F2F7] px-6 py-10 flex flex-col items-center justify-center">
      <div className="w-full max-w-sm text-center">
        <div className="mx-auto mb-6 h-24 w-24 rounded-full bg-[#E6DEFF] flex items-center justify-center">
          <span className="text-4xl" aria-hidden>
            🐣
          </span>
        </div>

        <h1 className="text-[44px] font-bold text-[#2F2750] leading-none">Project Bol</h1>
        <p className="mt-3 text-[18px] text-[#8A8898]">Speak. Learn. Grow.</p>

        <button
          onClick={() => navigate("/signup")}
          className="mt-10 w-full rounded-full bg-[#5B50D6] py-4 text-[18px] font-semibold text-white hover:bg-[#4F46C9] transition-colors"
        >
          Get started
        </button>

        <p className="mt-4 text-[16px] text-[#8A8898]">
          Already have an account?{" "}
          <button
            onClick={() => navigate("/login")}
            className="font-semibold text-[#5B50D6]"
          >
            Login
          </button>
        </p>
      </div>
    </div>
  );
}