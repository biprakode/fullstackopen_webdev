import React from 'react';
import { BookOpenText, CheckCircle } from 'lucide-react';

const Total = ({parts}) => {
  const total = parts.reduce((sum , part) => {
    return sum+=part.exercises
  },0)
  return <div className="mt-4 p-3 bg-indigo-50 rounded-lg shadow-inner flex justify-between items-center">
      <span className="text-sm font-semibold text-indigo-700 uppercase tracking-wider">
        Total Exercises
      </span>
      <b className="text-xl font-extrabold text-indigo-800">
        {total}
      </b>
    </div>
}

const Header = ({header}) => {
  return <h2 className="text-3xl font-bold text-gray-800 mb-4 border-b-2 border-indigo-200 pb-2">
      {header}
    </h2>
}

const Part = ({key, name, exercises }) => {
  return <li className="flex justify-between items-center py-2 px-3 border-b border-gray-100 last:border-b-0">
      <div className="flex items-center">
        <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
        <span className="text-base text-gray-700">{name}</span>
      </div>
      <span className="text-sm font-medium text-indigo-600 bg-indigo-100 px-2 py-0.5 rounded-full">
        {exercises}
      </span>
    </li>
}

const Body = ({parts}) => {
  return (
    <ul className="space-y-1 bg-white p-2 rounded-lg border border-gray-100 shadow-sm">
      {parts.map(part => <Part key={part.id} name={part.name} exercises={part.exercises} />)}
    </ul>
  )
}

const Course = ({course}) => {  
  const {parts} = course
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition duration-300 transform hover:scale-[1.01] mb-8 border border-gray-200">
      <Header header={course.name} />
      <Body parts={parts}/>
      <Total parts={parts}/>
    </div>
  )
}

const HandleCourse = ({ courses }) => {
  return (
    <div className="space-y-10">
      {courses.map(course => (
        <Course key={course.id} course={course} />
      ))}
    </div>
  );
};

const App = () => {
  const courses = [
    {
      name: 'Half Stack application development',
      id: 1,
      parts: [
        { name: 'Fundamentals of React', exercises: 10, id: 1 },
        { name: 'Using props to pass data', exercises: 7, id: 2 },
        { name: 'State of a component', exercises: 14, id: 3 },
        { name: 'Redux', exercises: 11, id: 4 }
      ]
    },
    {
      name: 'Node.js',
      id: 2,
      parts: [
        { name: 'Routing', exercises: 3, id: 1 },
        { name: 'Middlewares', exercises: 7, id: 2 }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8 font-sans">
      <div className="max-w-4xl mx-auto">
        
        <header className="py-6 mb-10 text-center border-b-4 border-indigo-500">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight flex items-center justify-center">
            <BookOpenText className="w-8 h-8 sm:w-10 sm:h-10 text-indigo-600 mr-3" />
            Web Dev Curriculum
          </h1>
          <p className="mt-2 text-xl text-indigo-500 font-light">
            A comprehensive overview of required skills
          </p>
        </header>

        <HandleCourse courses={courses} />
      </div>
    </div>
  );
};

export default App;
