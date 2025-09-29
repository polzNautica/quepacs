export default function Background() {
  return (
    <div className="fixed h-[100vh] w-[100vw] bg-transparent">
      <div className="absolute 
         bg-[radial-gradient(circle_farthest-side,rgba(46,90,184,0.2),rgba(255,255,255,0))] 
         rounded-full 
         w-[500px] 
         h-[500px]
         md:w-[800px]
         md:h-[800px]
         transform
         md:translate-x-[30%]
         md:translate-y-[0%]
         translate-x-[-10%]
         translate-y-[90%]
         "
      />
      <div className="absolute 
         bg-[radial-gradient(circle_farthest-side,rgba(46,90,184,0.2),rgba(255,255,255,0))] 
         rounded-full 
         w-[500px] 
         h-[500px]
         md:w-[800px]
         md:h-[800px]
         transform
         md:translate-x-[-40%]
         md:translate-y-[20%]
         translate-x-[0%]
         translate-y-[0%]
         "
      />
    </div>
  );
}