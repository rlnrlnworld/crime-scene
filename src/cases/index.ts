import { atelierTheft } from './atelier-theft'
import { cafeMurder } from './cafe-murder'
import { metroMissing } from './metro'
import type { Case } from './types'

export const cases: Case[] = [cafeMurder, atelierTheft, metroMissing]
export type { Case } from './types'
