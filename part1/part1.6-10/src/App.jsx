import { useState } from 'react'

const Button = ({handleClick , children}) => {
  return <button
      onClick={handleClick}
      className={`
        px-6 py-3 mx-2 text-white font-semibold rounded-xl shadow-md transition 
        duration-200 transform hover:scale-[1.05] active:scale-[0.98] 
        bg-blue-500 hover:bg-blue-600 || 'bg-gray-500 hover:bg-gray-600'}
      `}>{children}</button>
}

const StatDisplay = ({stat , text}) => {
  return (
    <div className="flex justify-between items-center py-2 px-4 border-b border-gray-200">
      <span className="font-medium capitalize text-lg">{text}:</span>
      <span className={`text-2xl font-bold text-blue-600`}>{stat}</span>
    </div>
  );
}

const Statistics = ({good , neutral , bad}) => {
  const all = good + neutral + bad;
  if (all === 0) {
    return <p className="text-gray-500 italic mt-4">No feedback given yet.</p>;
  }
  const average = (good - bad) / all;
  const positive = (good / all) * 100;
  return (
    <div className="mt-6 space-y-2">
      <StatDisplay stat={good} text="good" />
      <StatDisplay stat={neutral} text="neutral" />
      <StatDisplay stat={bad} text="bad" />
      <div className="border-t pt-4 space-y-2">
        <StatDisplay stat={all} text="all" />
        <StatDisplay stat={average.toFixed(2)} text="average" />
        <StatDisplay stat={`${positive.toFixed(2)} %`} text="positive" />
      </div>
    </div>
  );
}

const App = () => {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const goodClick = () => setGood(good + 1);
  const neutralClick = () => setNeutral(neutral + 1);
  const badClick = () => setBad(bad + 1);

  return (
    <div className="p-8 bg-gray-100 min-h-screen flex flex-col items-center">
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-2xl">
        <div className="mb-8 border-b pb-6">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4 text-center">Give Feedback</h1>
          <div className="flex justify-center">
            <Button handleClick={goodClick} colorClass="bg-green-500 hover:bg-green-600">good</Button>
            <Button handleClick={neutralClick} colorClass="bg-blue-500 hover:bg-blue-600">neutral</Button>
            <Button handleClick={badClick} colorClass="bg-red-500 hover:bg-red-600">bad</Button>
          </div>
        </div>
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-4 text-center">Statistics</h1>
            <Statistics good={good} neutral={neutral} bad={bad} /> {/*better design*/}
          </div>
        </div>
    </div>
  )
}

export default App