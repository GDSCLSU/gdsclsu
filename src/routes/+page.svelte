<script lang="ts">
  import gsap from "gsap";
  import { onMount } from "svelte";
  import BlobBackground from "$lib/components/BlobBackground.svelte";
  import { reveal } from "$lib/utils/reveal";

  const HACKATHON_START = new Date("2026-10-23T18:00:00-05:00");
  let now = $state(new Date());

  onMount(() => {
    const hasSeenIntro = sessionStorage.getItem("gdsc_intro_played");
    const animationDelay = hasSeenIntro ? 0 : 2.3;

    gsap.from(".mainCard", {
      duration: 1.8,
      opacity: 0,
      y: 40,
      scale: 0.95,
      delay: animationDelay,
      ease: "power4.out",
    });

    const interval = setInterval(() => {
      now = new Date();
    }, 1000);

    return () => clearInterval(interval);
  });

  let remainingMs = $derived(
    Math.max(0, HACKATHON_START.getTime() - now.getTime()),
  );
  let days = $derived(Math.floor(remainingMs / (1000 * 60 * 60 * 24)));
  let hours = $derived(Math.floor((remainingMs / (1000 * 60 * 60)) % 24));
  let minutes = $derived(Math.floor((remainingMs / (1000 * 60)) % 60));
  let seconds = $derived(Math.floor((remainingMs / 1000) % 60));

  let countdownParts = $derived([
    { label: "Days", value: days },
    { label: "Hours", value: hours },
    { label: "Minutes", value: minutes },
    { label: "Seconds", value: seconds },
  ]);
</script>

<main class="relative w-full overflow-x-hidden">
  <div class="fixed inset-0 z-0 pointer-events-none">
    <BlobBackground />
  </div>

  <section
    class="flex min-h-dvh w-full flex-col items-center justify-center px-4 relative z-10"
  >
    <div
      class="mainCard z-10 flex flex-col gap-4 sm:gap-5 items-center justify-center
                min-h-[50vh] sm:h-[55vh] w-[90vw] sm:w-[85vw] max-w-5xl rounded-3xl
                bg-white/10 dark:bg-slate-900/20
                backdrop-blur-2xl
                border border-white/20 dark:border-slate-700/30
                shadow-[0_25px_60px_-15px_rgba(0,0,0,0.15)]
                relative p-6 sm:p-0"
    >
      <p class="text-white text-xl sm:text-2xl text-center">Welcome to</p>

      <h1
        class="text-transparent bg-clip-text bg-linear-to-r from-white via-[#c6b8ff] to-[#c6b8ff]
                text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tight select-none
                mx-4 sm:mx-10
                filter drop-shadow-[0_2px_10px_rgba(15,23,42,0.15)]
                dark:drop-shadow-[0_4px_20px_rgba(159,134,255,0.4)]
                animate-gradient-flow bg-size-[200%_auto] text-center leading-tight"
      >
        GDSC <br /> LSU
      </h1>
    </div>
  </section>

  <section id="countdown">
    <a href="https://geauxhack.com">
      <div
        class="flex h-dvh w-full flex-col items-center justify-center px-6 md:px-10 relative z-10"
      >
        <div
          use:reveal
          class="w-full max-w-4xl bg-[#273e47] dark:bg-[#273e47] rounded-[3rem] p-8 md:p-16 border border-white/10 shadow-2xl flex flex-col items-center text-center backdrop-blur-xl"
        >
          <div
            class="font-display text-5xl font-bold md:text-7xl flex flex-wrap"
          >
            <pre class="text-[#d8c99b]">Geaux</pre>
            <pre class="text-[#d8973c]">Hack</pre>
            <pre class="text-[#a4243b]">'26</pre>
          </div>
          <p
            class="font-mono-retro mt-4 text-xs uppercase tracking-[0.3em] text-[#eaddcf]/70 md:text-sm"
          >
            T-minus
          </p>

          <div
            class="mt-10 flex flex-wrap items-center justify-center gap-3 sm:gap-6"
          >
            {#each countdownParts as part}
              <div
                class="flex flex-col items-center gap-2 rounded-xl border border-amber-500/30 bg-[#38484e] px-4 py-3 sm:px-6 sm:py-4 min-w-[80px] sm:min-w-[110px]"
              >
                <span
                  class="font-mono-retro glow-amber text-3xl font-bold text-[#d8973c] sm:text-5xl"
                  >{part.value.toString().padStart(2, "0")}</span
                >
                <span
                  class="font-mono-retro text-[0.65rem] uppercase tracking-[0.25em] text-[#eaddcf]/60"
                  >{part.label}</span
                >
              </div>
            {/each}
          </div>
        </div>
      </div>
    </a>
  </section>

  <section
    id="join"
    class="relative flex h-dvh w-full flex-col items-center justify-center px-6 text-center md:px-10 z-10"
  >
    <div
      class="glow-breathe pointer-events-none absolute left-1/2 top-1/2 h-[75%] w-[75%] -translate-x-1/2 -translate-y-1/2 rounded-full"
    ></div>
    <div use:reveal class="relative mx-auto max-w-3xl">
      <span
        class="inline-block py-1.5 px-4 rounded-full bg-primary-color/15 text-primary-color text-sm font-bold tracking-wider uppercase mb-6 border border-primary-color/30"
      >
        Get Involved
      </span>
      <h2
        class="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 text-transparent bg-clip-text bg-linear-to-r from-[#7c5cff] via-[#b39fff] to-[#7c5cff] animate-gradient-flow bg-size-[200%_auto]"
      >
        Build with us.
      </h2>
      <p
        class="text-xl text-slate-600 dark:text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed"
      >
        Whether you are a seasoned developer or just starting out, there is a
        place for you here. Join the community, learn new skills, and create
        impactful software.
      </p>

      <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
        <a
          href="/login"
          class="btn-shine w-full sm:w-auto px-8 py-4 rounded-full bg-linear-to-r from-primary-color to-[#3b82f6] text-white font-bold text-lg hover:scale-105 transition-all shadow-lg shadow-primary-color/25 hover:shadow-[0_0_45px_rgba(159,134,255,0.55)]"
        >
          Become a Member
        </a>
        <a
          href="/about"
          class="btn-shine-purple w-full sm:w-auto px-8 py-4 rounded-full bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold text-lg border border-slate-200 dark:border-slate-700 transition-all duration-300 hover:-translate-y-0.5 hover:scale-[1.03] hover:border-[#9f86ff]/60 hover:bg-slate-50 hover:shadow-[0_10px_30px_-8px_rgba(159,134,255,0.45)] dark:hover:bg-slate-700"
        >
          Learn More
        </a>
      </div>
    </div>
  </section>

  <section
    id="socials"
    class="flex h-dvh w-full flex-col items-center justify-center px-6 text-center md:px-10 relative z-10"
  >
    <div
      class="hub-glow pointer-events-none absolute left-1/2 top-1/2 h-[78%] w-[78%] -translate-x-1/2 -translate-y-1/2 rounded-full"
    ></div>
    <span class="twinkle" style="top: 12%; left: 15%; animation-delay: 0s"
    ></span>
    <span class="twinkle" style="top: 20%; right: 12%; animation-delay: 0.6s"
    ></span>
    <span class="twinkle" style="top: 32%; left: 6%; animation-delay: 1.2s"
    ></span>
    <span class="twinkle" style="top: 46%; right: 5%; animation-delay: 0.3s"
    ></span>
    <span class="twinkle" style="top: 60%; left: 10%; animation-delay: 1.8s"
    ></span>
    <span class="twinkle" style="top: 72%; right: 13%; animation-delay: 0.9s"
    ></span>
    <span class="twinkle" style="top: 84%; left: 20%; animation-delay: 1.5s"
    ></span>
    <span class="twinkle" style="top: 90%; right: 8%; animation-delay: 2.1s"
    ></span>
    <div use:reveal class="relative mx-auto max-w-4xl">
      <h2
        class="text-4xl md:text-6xl font-bold mb-4 md:mb-6 text-transparent bg-clip-text bg-linear-to-r from-[#7c5cff] via-[#b39fff] to-[#7c5cff] animate-gradient-flow bg-size-[200%_auto]"
      >
        Connect with us
      </h2>
      <p
        class="mb-10 text-lg text-slate-500 dark:text-slate-400 md:mb-14 md:text-xl"
      >
        Pick a platform, or join the GDG hub where the whole community lives.
      </p>

      <div
        class="relative mx-auto aspect-square w-full max-w-90 sm:max-w-120 md:max-w-145"
      >
        <div class="orbit-ring dark:border-slate-600/40 h-[62%] w-[62%]"></div>
        <div class="orbit-ring dark:border-slate-600/40 h-[82%] w-[82%]"></div>
        <!-- svelte-ignore a11y_consider_explicit_label -->
        <a
          href="https://gdg.community.dev/gdg-on-campus-louisiana-state-university/"
          rel="noopener noreferrer"
          aria-label="GDG On Campus community hub"
          class="group absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2"
        >
          <div
            class="relative flex h-28 w-28 items-center justify-center sm:h-36 sm:w-36 md:h-48 md:w-48"
          >
            <span
              class="pulse-ring absolute -inset-3 rounded-full sm:-inset-5 md:-inset-6"
            ></span>
            <span
              class="gdg-hover-ring absolute -inset-2 rounded-full opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            ></span>
            <span
              class="relative z-10 flex h-full w-full items-center justify-center rounded-full border-2 border-white bg-white shadow-2xl transition-transform duration-300 group-hover:scale-105 dark:border-slate-800 dark:bg-slate-800"
            >
              <svg
                class="h-12 w-12 text-[#4285F4] sm:h-16 sm:w-16 md:h-20 md:w-20"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                />
              </svg>
            </span>
            <span
              class="sat-label bg-white/90 border border-slate-200 text-slate-700 dark:bg-slate-800/90 dark:border-slate-600 dark:text-slate-200"
            >
              GDG On Campus
            </span>
          </div>
        </a>

        <!-- svelte-ignore a11y_consider_explicit_label -->
        <a
          href="https://discord.gg/4aJU7UHUE2"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Discord"
          class="group absolute left-[82%] top-[25%] z-10 -translate-x-1/2 -translate-y-1/2"
        >
          <span class="float-y block" style="animation-delay: 1.7s">
            <span
              class="flex h-14 w-14 items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 group-hover:-translate-y-2 group-hover:border-[#5865F2] group-hover:bg-[#5865F2]/10 group-hover:shadow-[0_12px_40px_-8px_rgba(88,101,242,0.5)] dark:border-slate-700 dark:bg-slate-800 sm:h-20 sm:w-20 md:h-24 md:w-24"
            >
              <svg
                class="h-7 w-7 text-slate-400 transition-colors group-hover:text-[#5865F2] sm:h-9 sm:w-9 md:h-11 md:w-11"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189z"
                />
              </svg>
            </span>
            <span
              class="sat-label bg-white/90 border border-slate-200 text-slate-700 dark:bg-slate-800/90 dark:border-slate-600 dark:text-slate-200"
            >
              Discord
            </span>
          </span>
        </a>

        <!-- svelte-ignore a11y_consider_explicit_label -->
        <a
          href="https://linkedin.com/company/gdsclsu/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="LinkedIn"
          class="group absolute left-1/2 top-[9%] z-10 -translate-x-1/2 -translate-y-1/2"
        >
          <span class="float-y block" style="animation-delay: 0.2s">
            <span
              class="flex h-14 w-14 items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 group-hover:-translate-y-2 group-hover:border-[#0077b5] group-hover:bg-[#0077b5]/10 group-hover:shadow-[0_12px_40px_-8px_rgba(0,119,181,0.5)] dark:border-slate-700 dark:bg-slate-800 sm:h-20 sm:w-20 md:h-24 md:w-24"
            >
              <svg
                class="h-7 w-7 text-slate-400 transition-colors group-hover:text-[#0077b5] sm:h-9 sm:w-9 md:h-11 md:w-11"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"
                />
              </svg>
            </span>
            <span
              class="sat-label bg-white/90 border border-slate-200 text-slate-700 dark:bg-slate-800/90 dark:border-slate-600 dark:text-slate-200"
            >
              LinkedIn
            </span>
          </span>
        </a>

        <!-- svelte-ignore a11y_consider_explicit_label -->
        <a
          href="https://github.com/gdsclsu"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub"
          class="group absolute left-[90%] top-[59%] z-10 -translate-x-1/2 -translate-y-1/2"
        >
          <span class="float-y block" style="animation-delay: 0.8s">
            <span
              class="flex h-14 w-14 items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 group-hover:-translate-y-2 group-hover:border-slate-900 group-hover:bg-slate-900/10 group-hover:shadow-[0_12px_40px_-8px_rgba(15,23,42,0.5)] dark:border-slate-700 dark:bg-slate-800 dark:group-hover:border-white sm:h-20 sm:w-20 md:h-24 md:w-24"
            >
              <svg
                class="h-7 w-7 text-slate-400 transition-colors group-hover:text-slate-900 dark:group-hover:text-white sm:h-9 sm:w-9 md:h-11 md:w-11"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  fill-rule="evenodd"
                  d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                  clip-rule="evenodd"
                />
              </svg>
            </span>
            <span
              class="sat-label bg-white/90 border border-slate-200 text-slate-700 dark:bg-slate-800/90 dark:border-slate-600 dark:text-slate-200"
            >
              GitHub
            </span>
          </span>
        </a>

        <!-- svelte-ignore a11y_consider_explicit_label -->
        <a
          href="https://instagram.com/gdsclsu"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Instagram"
          class="group absolute left-[68%] top-[87%] z-10 -translate-x-1/2 -translate-y-1/2"
        >
          <span class="float-y block" style="animation-delay: 1.4s">
            <span
              class="flex h-14 w-14 items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 group-hover:-translate-y-2 group-hover:border-[#E1306C] group-hover:bg-[#E1306C]/10 group-hover:shadow-[0_12px_40px_-8px_rgba(225,48,108,0.5)] dark:border-slate-700 dark:bg-slate-800 sm:h-20 sm:w-20 md:h-24 md:w-24"
            >
              <svg
                class="h-7 w-7 text-slate-400 transition-colors group-hover:text-[#E1306C] sm:h-9 sm:w-9 md:h-11 md:w-11"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  fill-rule="evenodd"
                  d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                  clip-rule="evenodd"
                />
              </svg>
            </span>
            <span
              class="sat-label bg-white/90 border border-slate-200 text-slate-700 dark:bg-slate-800/90 dark:border-slate-600 dark:text-slate-200"
            >
              Instagram
            </span>
          </span>
        </a>

        <!-- svelte-ignore a11y_consider_explicit_label -->
        <a
          href="https://www.youtube.com/@dsclsu1856"
          rel="noopener noreferrer"
          aria-label="YouTube"
          class="group absolute left-[32%] top-[87%] z-10 -translate-x-1/2 -translate-y-1/2"
        >
          <span class="float-y block">
            <span
              class="flex h-14 w-14 items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 group-hover:-translate-y-2 group-hover:border-[#FF0000] group-hover:bg-[#FF0000]/10 group-hover:shadow-[0_12px_40px_-8px_rgba(255,0,0,0.5)] dark:border-slate-700 dark:bg-slate-800 sm:h-20 sm:w-20 md:h-24 md:w-24"
            >
              <svg
                class="h-7 w-7 text-slate-400 transition-colors group-hover:text-[#FF0000] sm:h-9 sm:w-9 md:h-11 md:w-11"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"
                />
              </svg>
            </span>
            <span
              class="sat-label bg-white/90 border border-slate-200 text-slate-700 dark:bg-slate-800/90 dark:border-slate-600 dark:text-slate-200"
            >
              YouTube
            </span>
          </span>
        </a>

        <!-- svelte-ignore a11y_consider_explicit_label -->
        <a
          href="https://facebook.com/dsc.lsu"
          rel="noopener noreferrer"
          aria-label="Facebook"
          class="group absolute left-[10%] top-[59%] z-10 -translate-x-1/2 -translate-y-1/2"
        >
          <span class="float-y block" style="animation-delay: 1s">
            <span
              class="flex h-14 w-14 items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 group-hover:-translate-y-2 group-hover:border-[#1877F2] group-hover:bg-[#1877F2]/10 group-hover:shadow-[0_12px_40px_-8px_rgba(24,119,242,0.5)] dark:border-slate-700 dark:bg-slate-800 sm:h-20 sm:w-20 md:h-24 md:w-24"
            >
              <svg
                class="h-7 w-7 text-slate-400 transition-colors group-hover:text-[#1877F2] sm:h-9 sm:w-9 md:h-11 md:w-11"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
                />
              </svg>
            </span>
            <span
              class="sat-label bg-white/90 border border-slate-200 text-slate-700 dark:bg-slate-800/90 dark:border-slate-600 dark:text-slate-200"
            >
              Facebook
            </span>
          </span>
        </a>

        <!-- svelte-ignore a11y_consider_explicit_label -->
        <a
          href="https://tigerlink.lsu.edu/feeds?type=club&type_id=61133&tab=about"
          rel="noopener noreferrer"
          aria-label="TigerLink"
          class="group absolute left-[18%] top-[25%] z-10 -translate-x-1/2 -translate-y-1/2"
        >
          <span class="float-y block" style="animation-delay: 0.5s">
            <span
              class="flex h-14 w-14 items-center justify-center rounded-2xl border border-slate-200 bg-white p-3 shadow-sm transition-all duration-300 group-hover:-translate-y-2 group-hover:border-[#461D7C] group-hover:bg-[#461D7C]/10 group-hover:shadow-[0_12px_40px_-8px_rgba(70,29,124,0.5)] dark:border-slate-700 dark:bg-slate-800 sm:h-20 sm:w-20 md:h-24 md:w-24"
            >
              <img
                src="/lsu-tiger-logo.png"
                alt="LSU Tiger Logo"
                class="h-full w-full object-contain grayscale transition-all duration-300 group-hover:scale-105 group-hover:grayscale-0"
              />
            </span>
            <span
              class="sat-label bg-white/90 border border-slate-200 text-slate-700 dark:bg-slate-800/90 dark:border-slate-600 dark:text-slate-200"
            >
              TigerLink
            </span>
          </span>
        </a>
      </div>
    </div>
  </section>
</main>

<style>
  :global(.reveal) {
    opacity: 0;
    transform: translateY(40px);
    transition:
      opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1),
      transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
    will-change: opacity, transform;
  }

  :global(.reveal.is-visible) {
    opacity: 1;
    transform: translateY(0);
  }

  .pulse-ring {
    background: radial-gradient(
      circle,
      rgba(159, 134, 255, 0.55),
      rgba(159, 134, 255, 0) 70%
    );
    animation: pulse-glow 2.8s ease-in-out infinite;
  }

  .glow-breathe {
    background: radial-gradient(
      circle,
      rgba(159, 134, 255, 0.3),
      rgba(159, 134, 255, 0) 70%
    );
  }

  .hub-glow {
    background: radial-gradient(
      circle,
      rgba(159, 134, 255, 0.22),
      rgba(159, 134, 255, 0) 68%
    );
  }

  .twinkle {
    position: absolute;
    width: 0.4rem;
    height: 0.4rem;
    border-radius: 9999px;
    background: #9f86ff;
    box-shadow: 0 0 8px rgb(159 134 255 / 0.8);
    animation: twinkle 3.2s ease-in-out infinite;
    pointer-events: none;
  }

  .gdg-hover-ring {
    border: 2px solid rgb(159 134 255 / 0.7);
    box-shadow:
      0 0 35px rgb(159 134 255 / 0.45),
      inset 0 0 35px rgb(159 134 255 / 0.2);
  }

  .btn-shine {
    position: relative;
    overflow: hidden;
  }

  .btn-shine::after {
    content: "";
    position: absolute;
    top: 0;
    left: -75%;
    width: 50%;
    height: 100%;
    background: linear-gradient(
      120deg,
      transparent,
      rgb(255 255 255 / 0.45),
      transparent
    );
    transform: skewX(-20deg);
    transition: left 0.6s ease;
  }

  .btn-shine:hover::after {
    left: 125%;
  }

  .btn-shine-purple {
    position: relative;
    overflow: hidden;
  }

  .btn-shine-purple::after {
    content: "";
    position: absolute;
    top: 0;
    left: -75%;
    width: 50%;
    height: 100%;
    background: linear-gradient(
      120deg,
      transparent,
      rgb(159 134 255 / 0.35),
      transparent
    );
    transform: skewX(-20deg);
    transition: left 0.6s ease;
  }

  .btn-shine-purple:hover::after {
    left: 125%;
  }

  .sat-label {
    position: absolute;
    left: 50%;
    top: calc(100% + 0.65rem);
    transform: translateX(-50%);
    white-space: nowrap;
    font-size: 0.65rem;
    font-weight: 600;
    letter-spacing: 0.05em;
    padding: 0.3rem 0.7rem;
    border-radius: 9999px;
    box-shadow: 0 6px 16px rgb(0 0 0 / 0.12);
    opacity: 0;
    pointer-events: none;
    transition:
      opacity 0.25s ease,
      transform 0.25s ease;
    z-index: 30;
  }

  .group:hover .sat-label {
    opacity: 1;
  }

  .orbit-ring {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    border: 1.5px dashed rgb(148 163 184 / 0.35);
    border-radius: 9999px;
    pointer-events: none;
  }

  .float-y {
    animation: float-y 4.5s ease-in-out infinite;
  }

  @keyframes float-y {
    0%,
    100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-7px);
    }
  }

  @keyframes twinkle {
    0%,
    100% {
      opacity: 0.1;
      transform: scale(0.7);
    }
    50% {
      opacity: 0.9;
      transform: scale(1.25);
    }
  }

  @keyframes pulse-glow {
    0%,
    100% {
      opacity: 0.55;
      transform: scale(1);
    }
    50% {
      opacity: 0.9;
      transform: scale(1.08);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .pulse-ring,
    .float-y,
    .twinkle {
      animation: none;
    }
  }
</style>
