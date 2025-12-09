import React from 'react'

export default function ExamCard({ exam, onPay }: any) {
  return (
    <div className="border rounded p-4 bg-white">
      <h3 className="font-semibold">{exam.title} — Nr. {exam.number}</h3>
      <p className="text-sm text-gray-600">Preis: {exam.price ?? 0} €</p>
      <div className="mt-3">
        {exam.isPaid ? (
          <a className="text-blue-600" href={exam.fileUrl} target="_blank" rel="noreferrer">Dokument öffnen</a>
        ) : (
          <button onClick={() => onPay(exam._id)} className="px-3 py-1 bg-indigo-600 text-white rounded">Jetzt kaufen</button>
        )}
      </div>
    </div>
  )
}
