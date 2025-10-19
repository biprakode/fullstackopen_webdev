import { useState } from 'react'

const Display = ({ text, votes }) => {
  return (
    <div className="p-4 bg-white shadow-inner rounded-lg border border-gray-200">
      <p className="text-xl italic text-gray-800 mb-2 leading-relaxed">
        "{text}"
      </p>
      <p className="text-sm font-semibold text-indigo-600 mt-3">
          Anecdote has {votes} votes.
      </p>
    </div>
  );
};

const Button = ({ handleClick, children }) => {
  return (
    <button
      onClick={handleClick}
      className={`
        px-6 py-2 mx-2 text-white font-semibold rounded-xl shadow-md transition 
        duration-200 transform hover:scale-[1.03] active:scale-[0.98] focus:outline-none
        bg-gray-500 hover:bg-gray-600
      `}
    >
      {children}
    </button>
  );
};

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.',
    'The only way to go fast, is to go well.'
  ]
   
  const [selected, setSelected] = useState(0)
  const [votes , setvotes] = useState(new Array(anecdotes.length).fill(0)); // simple array

  const handleNext = () => {
    const randIndex = Math.floor(Math.random() * anecdotes.length)
    setSelected(randIndex);
  }
  const handleVote = () => {
    const newvotes = [...votes]
    newvotes[selected]+=1
    setvotes(newvotes)
  };

  const maxVote = Math.max(...votes)
  const maxVoteIndex = votes.indexOf(maxVote)
  const hasVoted = maxVote === 0

  return (
    <div className="p-8 bg-blue-800 min-h-screen flex flex-col items-center font-sans">
      <div className="w-full max-w-2xl p-8 bg-white rounded-2xl shadow-2xl">
        <div className="mb-10 border-b pb-6">
          <h2 className="text-4xl font-extrabold text-indigo-700 mb-6 border-b-2 pb-2">
            Anecdote of the Day
          </h2>
          <Display text={anecdotes[selected]} votes={votes[selected]} />
          <div className="mt-6 flex justify-start">
            <Button handleClick={handleVote}>Vote</Button>
            <Button handleClick={handleNext}>Next Anecdote</Button>
          </div>
        </div>
        <div>
          <h2 className="text-4xl font-extrabold text-indigo-700 mb-6 border-b-2 pb-2">
            Most Voted Anecdote
          </h2>
          {hasVoted ? (<p className="text-gray-500 italic text-lg p-4"> No votes casteddd!</p>) : (<Display text={anecdotes[maxVoteIndex]} votes={votes[maxVoteIndex]}></Display>)}
        </div>     
      </div>
    </div>
  )
}

export default App