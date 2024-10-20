import { Banner } from "@/shared/Banner";
import Image from "next/image";

export default function Home() {
  return (
    <div className="h-screen min-h-screen">
      <Banner name="Collins" />
    </div>
  );
}
