import Carousel from "@/components/Carousel";
import { auth } from "@/auth";
// app/page.js
export default async function Home() {
const session = await auth();
console.log(session);
  return (
    <div>
      <Carousel />
    </div>
  );
}
