//reference: https://bg.ibelick.com/
export default function Background() {
  return (
    <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#f0f0f0_2px,transparent_2px),linear-gradient(to_bottom,#f0f0f0_2px,transparent_2px)] bg-[size:6rem_4rem]">
      <div className="absolute bottom-0 left-100 right-0 top-0 bg-[radial-gradient(circle_150vh_at_100%_50vw,#fce7f3,transparent)]"></div>
    </div>
  );
}
