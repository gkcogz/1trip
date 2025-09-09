// src/state/useTrip.ts
import { useEffect, useMemo, useRef, useState } from 'react'
import { Trip } from '@lib/types'
import { computeBudget } from '@lib/budget'
import { loadTrip, saveTrip } from '@lib/storage'

export function useTrip(initial:Trip){
  const [trip,setTrip] = useState<Trip>(loadTrip() || initial)
  const undoRef = useRef<Trip[]>([])
  const redoRef = useRef<Trip[]>([])

  const pushHistory = (prev:Trip)=>{
    undoRef.current.push(prev)
    if(undoRef.current.length>50) undoRef.current.shift()
    redoRef.current=[]
  }

  const set = (updater:(t:Trip)=>Trip)=> setTrip(prev=>{
    const before=structuredClone(prev)
    const next=updater(before)
    next.updatedAt=Date.now()
    pushHistory(prev)
    return next
  })

  const undo = ()=>{
    if(!undoRef.current.length) return
    const prev=undoRef.current.pop()!
    redoRef.current.push(trip)
    setTrip(prev)
  }

  const redo = ()=>{
    if(!redoRef.current.length) return
    const next=redoRef.current.pop()!
    undoRef.current.push(trip)
    setTrip(next)
  }

  useEffect(()=>{ saveTrip(trip) },[trip])

  const budget = useMemo(()=> computeBudget(trip),[trip])

  return { trip, setTrip:set, undo, redo, budget }
}