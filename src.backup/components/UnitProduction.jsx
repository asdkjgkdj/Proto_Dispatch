
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";

const GRADE_TIME = { N: 10, R: 30, SR: 60 };

export default function UnitProduction({ onComplete }) {
  const [queue, setQueue] = useState([]);

  const produceUnit = (grade) => {
    const id = Date.now();
    const finish = Date.now() + GRADE_TIME[grade] * 1000;
    setQueue(prev => [...prev, { id, grade, finish }]);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      const now = Date.now();
      const ready = queue.filter(q => now >= q.finish);
      if (ready.length) {
        ready.forEach(q => onComplete({ id: q.id, grade: q.grade }));
        setQueue(prev => prev.filter(q => now < q.finish));
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [queue, onComplete]);

  return (
    <Card>
      <CardContent>
        <h2 className="text-xl font-bold mb-2">Unit Production</h2>
        <div className="flex space-x-2 mb-4">
          {Object.keys(GRADE_TIME).map(grade => (
            <Button key={grade} onClick={() => produceUnit(grade)}>
              Produce {grade}
            </Button>
          ))}
        </div>
        <ul className="space-y-1">
          {queue.map(q => (
            <li key={q.id}>
              {q.grade} - {Math.max(0, Math.ceil((q.finish - Date.now()) / 1000))}s remaining
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}