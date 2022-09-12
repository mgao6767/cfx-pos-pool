import './App.css'
import Header from './components/Header'
import Content from './components/Content'

export default function App() {
  return (
    <div className="App h-screen overflow-y-scroll scrollbar-hide overflow-x-hidden px-6">
      <Header />
      <div className="flex items-start space-x-2 justify-start w-full ">
        <Content />
      </div>
    </div>
  )
}
