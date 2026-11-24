import { useEffect, useState } from "react";

export function DesktopPracticeNotice() {
  const [mobile, setMobile] = useState(false);

  useEffect(() => {
    const check = () => {
      const phone = /Android|iPhone|iPod|Windows Phone/i.test(navigator.userAgent);
      setMobile(phone);
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  if (!mobile) return null;

  return (
    <section className="desktop-practice-notice mx-auto max-w-3xl rounded-2xl border-2 border-[#a49b7a] bg-[#fffbea] p-6 text-center shadow-sm dark:border-[#596b54] dark:bg-[#202d24] sm:p-8">
      <p className="font-mono text-xs font-black uppercase tracking-[.18em] text-[#78805d] dark:text-[#d3c77d]">Desktop practice required</p>
      <h2 className="mt-2 text-2xl font-black text-[#3e4c39] dark:text-[#f1eedc]">Open KeyQuest on a laptop or desktop</h2>
      <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-[#68705b] dark:text-[#c6cebd]">
        The interactive typing practice uses a physical keyboard, so lessons, the speed test and typing games are designed for desktop computers. You can still read the lesson and learning information on this phone.
      </p>
      <p className="mt-4 text-xs font-semibold text-[#78805d] dark:text-[#b8c2ad]">Your progress remains available on this device when you return to practice on desktop.</p>
    </section>
  );
}
