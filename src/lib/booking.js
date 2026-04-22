export const BOOKING_TIMES = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
  '16:00', '16:30', '17:00', '17:30', '18:00', '18:30',
]

export function toMinutes(timeStr) {
  if (!timeStr || typeof timeStr !== 'string' || !timeStr.includes(':')) return 0
  const [hours, minutes] = timeStr.split(':').map(Number)
  return (hours || 0) * 60 + (minutes || 0)
}

export function durationToMinutes(duration) {
  if (!duration || typeof duration !== 'string') return 60

  const normalized = duration.trim().toLowerCase()
  if (!normalized) return 60

  const hourMatch = normalized.match(/(\d+)\s*h/)
  const minuteMatch = normalized.match(/(\d+)\s*min/)
  const plainNumberMatch = normalized.match(/^(\d+)$/)

  const hours = hourMatch ? Number.parseInt(hourMatch[1], 10) : 0
  const minutes = minuteMatch ? Number.parseInt(minuteMatch[1], 10) : 0

  if (hours || minutes) {
    return hours * 60 + minutes
  }

  if (plainNumberMatch) {
    return Number.parseInt(plainNumberMatch[1], 10)
  }

  return 60
}

export function getOccupiedSlots(startTime, duration = '1h') {
  const start = toMinutes(startTime)
  const durationMinutes = typeof duration === 'number' ? duration : durationToMinutes(duration)
  const end = start + durationMinutes

  return BOOKING_TIMES.filter((time) => {
    const minutes = toMinutes(time)
    return minutes >= start && minutes < end
  })
}

export function buildAppointmentBlockedSlots(appointments = []) {
  const blocked = new Set()

  appointments.forEach((appointment) => {
    if (!appointment?.time) return

    const occupiedSlots = getOccupiedSlots(
      appointment.time,
      appointment.duration || appointment.service_duration || '1h',
    )

    occupiedSlots.forEach((slot) => blocked.add(slot))
  })

  return blocked
}

export function buildManualBlockedSlots(blockedSlots = []) {
  const blocked = new Set()

  blockedSlots.forEach((slot) => {
    if (slot?.time) blocked.add(slot.time)
  })

  return blocked
}

export function isTimeSlotAvailable(slotTime, appointments = [], blockedSlots = [], serviceDuration = '1h') {
  const appointmentBlockedSlots = buildAppointmentBlockedSlots(appointments)
  const manualBlockedSlots = buildManualBlockedSlots(blockedSlots)
  const slotsNeeded = getOccupiedSlots(slotTime, serviceDuration)

  return slotsNeeded.every(
    (slot) => !appointmentBlockedSlots.has(slot) && !manualBlockedSlots.has(slot),
  )
}

export function getFullyBookedDates({ appointments = [], blocks = [] } = {}) {
  const occupiedByDate = new Map()

  appointments.forEach((appointment) => {
    if (!appointment?.date || !appointment?.time) return

    if (!occupiedByDate.has(appointment.date)) {
      occupiedByDate.set(appointment.date, new Set())
    }

    getOccupiedSlots(
      appointment.time,
      appointment.duration || appointment.service_duration || '1h',
    ).forEach((slot) => occupiedByDate.get(appointment.date).add(slot))
  })

  blocks.forEach((block) => {
    if (!block?.date || !block?.time) return

    if (!occupiedByDate.has(block.date)) {
      occupiedByDate.set(block.date, new Set())
    }

    occupiedByDate.get(block.date).add(block.time)
  })

  return Array.from(occupiedByDate.entries())
    .filter(([, slots]) => slots.size >= BOOKING_TIMES.length)
    .map(([date]) => date)
}
