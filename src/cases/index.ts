import { atelierTheft } from './atelier-theft'
import { cafeMurder } from './cafe-murder'
import type { Case } from './types'

export const cases: Case[] = [cafeMurder, atelierTheft]
export type { Case } from './types'
