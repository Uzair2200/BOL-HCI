interface AuthAppPreviewProps {
  compact?: boolean;
}

export function AuthAppPreview({ compact = false }: AuthAppPreviewProps) {
  return (
    <div className={`rounded-3xl border border-[#DCD2F4] bg-white/90 ${compact ? "p-4" : "p-5"}`}>
      <div className="flex items-center gap-2">
        <div className="h-8 w-8 rounded-xl bg-[#E6DEFF] flex items-center justify-center" aria-hidden>
          🎙️
        </div>
        <div>
          <h3 className="text-[15px] font-semibold text-[#2F2750]">How Project Bol Works</h3>
          <p className="text-[12px] text-[#7F7A94]">Short daily voice activities with your pet</p>
        </div>
      </div>

      <div className="mt-4 rounded-2xl border border-[#E9E3F8] bg-[#F7F3FF] p-3">
        <div className="mx-auto w-full max-w-[210px] rounded-[22px] border-2 border-[#CFC3F0] bg-[#FDFBFF] p-3">
          <div className="h-3 w-12 rounded-full bg-[#E5DDF7] mx-auto" />
          <div className="mt-3 h-4 w-24 rounded-full bg-[#E5DDF7]" />
          <div className="mt-2 h-16 rounded-2xl bg-[#ECE5FF]" />

          <div className="mt-3 flex items-center justify-between">
            <div className="h-2 w-14 rounded-full bg-[#DCD2F4]" />
            <div className="h-2 w-7 rounded-full bg-[#DCD2F4]" />
          </div>
          <div className="mt-2 h-2 w-full rounded-full bg-[#E5DDF7]" />

          <div className="mt-4 flex items-center justify-center">
            <div className="relative flex h-12 w-12 items-center justify-center rounded-full bg-[#7A63E6] text-white">
              <span className="text-lg" aria-hidden>
                🎤
              </span>
              <span className="absolute inset-0 rounded-full border-2 border-[#A898F0] animate-ping" />
            </div>
          </div>
        </div>
      </div>

      <div className={`mt-4 ${compact ? "space-y-1.5" : "space-y-2"}`}>
        <div className="flex items-center gap-2 text-[13px] text-[#4B4570]">
          <span aria-hidden>1.</span>
          <span>Listen to a short prompt</span>
        </div>
        <div className="flex items-center gap-2 text-[13px] text-[#4B4570]">
          <span aria-hidden>2.</span>
          <span>Tap mic and speak naturally</span>
        </div>
        <div className="flex items-center gap-2 text-[13px] text-[#4B4570]">
          <span aria-hidden>3.</span>
          <span>Earn XP and grow your pet</span>
        </div>
      </div>
    </div>
  );
}