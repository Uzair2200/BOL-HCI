import { useState } from "react";
import { useNavigate } from "react-router";

export default function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="min-h-screen bg-[#F2F2F7] px-6 py-10 flex items-center justify-center">
      <div className="w-full max-w-sm">
        <div className="rounded-3xl border border-[#E4E2ED] bg-white/75 p-5">
          <div className="mb-5 text-center">
            <div className="mx-auto mb-3 h-16 w-16 rounded-full bg-[#E6DEFF] flex items-center justify-center">
              <span className="text-3xl" aria-hidden>
                🐣
              </span>
            </div>
            <h2 className="text-[24px] font-semibold text-[#2F2750]">Project Bol</h2>
            <p className="mt-1 text-[14px] text-[#8A8898]">Speak. Learn. Grow.</p>
          </div>

          <h1 className="text-[32px] font-bold text-[#2F2750] leading-none">Login</h1>
          <p className="mt-2 text-[16px] text-[#8A8898]">Welcome back to Project Bol.</p>

          <div className="mt-5 space-y-3">
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              className="w-full rounded-2xl border border-[#D9D7E3] bg-white px-4 py-3 text-[16px] outline-none focus:border-[#5B50D6]"
            />
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              type="email"
              className="w-full rounded-2xl border border-[#D9D7E3] bg-white px-4 py-3 text-[16px] outline-none focus:border-[#5B50D6]"
            />
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              type="password"
              className="w-full rounded-2xl border border-[#D9D7E3] bg-white px-4 py-3 text-[16px] outline-none focus:border-[#5B50D6]"
            />
          </div>

          <button
            onClick={() => navigate("/home")}
            className="mt-5 w-full rounded-full bg-[#5B50D6] py-3.5 text-[18px] font-semibold text-white"
          >
            Login
          </button>

          <p className="mt-4 text-center text-[16px] text-[#8A8898]">
            Don&apos;t have an account?{" "}
            <button onClick={() => navigate("/signup")} className="font-semibold text-[#5B50D6]">
              Sign up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}