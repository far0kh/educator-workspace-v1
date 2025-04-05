import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import Landing from '@/components/layout/landing';
import ButtonGradient from "@/components/ui-custom/button-custom/button-gradient";

export default async function Home() {
  return (
    <div className="flex flex-col flex-1 min-w-0 justify-between">
      <Header />
      <Landing />
      <ButtonGradient />
      <Footer />
    </div>
  )
}
