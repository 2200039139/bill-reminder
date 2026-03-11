import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-10 rounded-xl shadow-lg text-center">
        <h1 className="text-3xl font-bold text-blue-600">
          Bill Reminder App
        </h1>

        <p className="text-gray-600 mt-3">
          React + Vite + Tailwind Working 🚀
        </p>

        <button className="mt-6 px-5 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
          Add Bill
        </button>
      </div>
    </div>
  );
}

export default App;