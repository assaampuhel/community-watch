import AuthForm from "./components/Authform";
import VerifyHandle from "./components/VerifyHandle";
import HomePage from "./components/HomePage";
function App() {
  return (
    <div className="min-h-screen bg-[#0d131f] text-white flex flex-col items-center justify-center p-6">
      
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-[#9fcaff]">Community Watch</h1>
        <p className="text-xs text-gray-400 font-mono tracking-widest uppercase mt-2">
          Clinical & Objective Moderation
        </p>
      </div>
      <HomePage/>
      <VerifyHandle />
      <AuthForm />

    </div>
  )
}

export default App;