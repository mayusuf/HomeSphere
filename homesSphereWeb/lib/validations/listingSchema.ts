import { z } from 'zod'

export const listingSchema = z.object({
  descriptionHtml:  z.string().min(20, 'Description must be at least 20 characters'),
  houseType:        z.enum(['apartment', 'house', 'single-room', 'townhouse'], {
    error: 'Please select a house type',
  }),
  listingFor:       z.enum(['SALE', 'RENT'], { error: 'Please select listing type' }),
  price:            z.number({ error: 'Price must be a number' }).positive('Price must be greater than 0'),
  bedrooms:         z.number().int().min(0, 'Bedrooms must be 0 or more'),
  bathrooms:        z.number().int().min(0, 'Bathrooms must be 0 or more'),
  squareFootage:    z.number().int().min(0).optional().nullable(),
  street:           z.string().min(1, 'Street address is required'),
  city:             z.string().min(1, 'City is required'),
  state:            z.string().min(1, 'State is required'),
  zip:              z.string().min(1, 'ZIP code is required'),
  listingAgentName: z.string().optional().nullable(),
  listingAgentPhone:z.string().optional().nullable(),
})

export type ListingFormData = z.infer<typeof listingSchema>
