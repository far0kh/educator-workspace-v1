"use client";

import ButtonCustom from "@/components/ui-custom/button-custom";
import { SignUpButton, SignedIn, SignedOut } from '@clerk/nextjs'
import Typewriter from "typewriter-effect";
import { useRouter } from 'next/navigation';

const Landing = () => {
  const router = useRouter();

  return (
    <main className="flex h-full my-auto overflow-y-auto">
      <div className="w-full flex flex-col justify-center items-center px-4" dir="ltr">
        <section className="space-y-6">
          <div className="flex flex-col gap-10 text-start">
            <div className="flex h-20 sm:h-24 md:h-32 lg:h-40 xl:h-46">
              <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-[5rem] xl:text-[6rem] font-poppins font-black text-balance">
                <Typewriter
                  onInit={(typewriter) => {
                    typewriter
                      .typeString('<span class="text-transparent bg-clip-text bg-gradient-to-r from-violet-700 via-pink-400 to-violet-500 tracking-wider">AI Powered</span>')
                      .typeString('<br /><span class="text-transparent bg-clip-text bg-gradient-to-r from-violet-500 via-violet-700 to-pink-400 tracking-wider">Workspace</span>')
                      .pauseFor(1500)
                      .deleteAll()
                      .typeString('<span class="text-transparent bg-clip-text bg-gradient-to-r from-violet-700 via-pink-400 to-violet-500 tracking-wider">For</span>')
                      .typeString('<br /><span class="text-transparent bg-clip-text bg-gradient-to-r from-violet-500 via-violet-700 to-pink-400 tracking-wider">Educators</span>')
                      .pauseFor(1500)
                      .deleteAll()
                      .start();
                  }}
                  options={{
                    autoStart: true,
                    loop: true,
                    delay: 50,
                    deleteSpeed: 10,
                  }}
                />
              </h1>
            </div>
            <p className="max-w-[42rem] mx-auto text-muted-foreground sm:text-xl text-balance">
              {/* Transform your teaching experience with our innovative, AI-powered workspace designed specifically for educators. We streamline and simplify the often-complex process of lesson planning, allowing you to create engaging and effective learning experiences with ease. Generate diverse and high-quality resources effortlessly, saving valuable time and energy in your preparation. Furthermore, our platform facilitates efficient and insightful feedback mechanisms, empowering you to provide personalized guidance and support to your students, all within a unified and intuitive digital environment. */}
              Revolutionize teaching with our AI-powered workspace for educators. Effortlessly generate diverse, high-quality resources and personalize student support, saving you valuable time.
            </p>
            <div className="flex flex-col gap-4 justify-center items-start">
              <SignedOut>
                <SignUpButton>
                  <ButtonCustom
                    className="font-semibold"
                    px="px-12"
                  >
                    Set Up Your Workspace
                  </ButtonCustom>
                </SignUpButton>
              </SignedOut>
              <SignedIn>
                <ButtonCustom
                  className="font-semibold"
                  px="px-12"
                  onClick={() => router.push('/chat')}
                >
                  Go To Workspace
                </ButtonCustom>
              </SignedIn>
            </div>
          </div>
        </section>
        {/* <div className="max-w-xl mx-auto">
      </div> */}
        {/* <div className="hidden max-w-[25rem] md:flex">
        <Image src="/hero.png" alt="Hero" className="scale-x-[-1]" width={800} height={800} />
      </div> */}
      </div>
    </main>
  );
}

export default Landing
