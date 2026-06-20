'use client'

import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { listingSchema, type ListingFormData } from '@/lib/validations/listingSchema'
import { createProperty, updateProperty, uploadPropertyImages, deletePropertyImage } from '@/lib/api/properties'
import type { PropertyImage } from '@/lib/api/properties'
import { useNotificationStore } from '@/store/useNotificationStore'
import { getUserInfo, type User } from '@/lib/api/users'
import { useRouter } from 'next/navigation'
import { useState, useRef, useEffect } from 'react'
import { X, ImagePlus } from 'lucide-react'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import RichTextEditor from '@/components/ui/RichTextEditor'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import Image from 'next/image'

function getOwnerId(): string {
  if (typeof document === 'undefined') return ''
  const m = document.cookie.match(/(?:^|;\s*)hs_user_id=([^;]+)/)
  return m ? m[1] : localStorage.getItem('hs_user_id') ?? ''
}

interface ListingFormProps {
  defaultValues?: Partial<ListingFormData>
  isEdit?: boolean
  propertyId?: string
  successRedirect?: string
  existingImages?: PropertyImage[]
  propertyStatus?: 'pending' | 'approved' | 'rejected'
}

export default function ListingForm({ defaultValues, isEdit = false, propertyId, successRedirect = '/my-properties', existingImages, propertyStatus }: ListingFormProps) {
  const router = useRouter()
  const addToast = useNotificationStore((s) => s.addToast)
  const [previewImages, setPreviewImages] = useState<string[]>([])
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'saving' | 'uploading'>('idle')
  const [apiError, setApiError] = useState<string | null>(null)
  const [existingImgs, setExistingImgs] = useState<PropertyImage[]>(existingImages ?? [])
  const [deletingImageId, setDeletingImageId] = useState<string | null>(null)
  const [agentUser, setAgentUser] = useState<User | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ListingFormData>({
    resolver: zodResolver(listingSchema),
    defaultValues: { bedrooms: 1, bathrooms: 1, ...defaultValues },
  })

  useEffect(() => {
    const id = getOwnerId()
    if (!id) return
    getUserInfo(id, true).then((user) => {
      if (!user) return
      setAgentUser(user)
      const fullName = `${user.first_name} ${user.last_name}`.trim()
      setValue('listingAgentName', defaultValues?.listingAgentName ?? fullName)
      setValue('listingAgentPhone', defaultValues?.listingAgentPhone ?? user.phone_number ?? '')
    })
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? [])
    setSelectedFiles((prev) => [...prev, ...files])
    files.forEach((file) => {
      const reader = new FileReader()
      reader.onload = (ev) => {
        if (ev.target?.result) setPreviewImages((prev) => [...prev, ev.target!.result as string])
      }
      reader.readAsDataURL(file)
    })
    e.target.value = ''
  }

  function removeImage(index: number) {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index))
    setPreviewImages((prev) => prev.filter((_, i) => i !== index))
  }

  async function deleteExistingImage(imageId: string) {
    if (!propertyId) return
    setDeletingImageId(imageId)
    try {
      await deletePropertyImage(propertyId, imageId, true)
      setExistingImgs((prev) => prev.filter((img) => img.imageId !== imageId))
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to delete image.'
      addToast(msg, 'error')
    } finally {
      setDeletingImageId(null)
    }
  }

  async function onSubmit(data: ListingFormData) {
    setApiError(null)
    try {
      let targetId = propertyId ?? ''

      const payload: typeof data = {
        ...data,
        listingAgentName: agentUser
          ? `${agentUser.first_name} ${agentUser.last_name}`.trim()
          : (data.listingAgentName ?? null),
        listingAgentPhone: agentUser?.phone_number ?? data.listingAgentPhone ?? null,
      }

      setUploadStatus('saving')
      if (isEdit && propertyId) {
        await updateProperty(propertyId, payload, true)
      } else {
        const ownerId = getOwnerId()
        const created = await createProperty(ownerId, payload, true)
        targetId = created.id
      }

      if (selectedFiles.length > 0) {
        setUploadStatus('uploading')
        await uploadPropertyImages(targetId, selectedFiles)
        setSelectedFiles([])
        setPreviewImages([])
      }

      addToast(isEdit ? 'Property updated successfully!' : 'Property submitted for review!', 'success')
      setTimeout(() => {
        router.push(successRedirect)
      }, 1000)
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to save property.'
      setApiError(msg)
      addToast(msg, 'error')
    } finally {
      setUploadStatus('idle')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {propertyStatus && (
        <div className="flex items-center gap-3 p-4 rounded-lg bg-surface border border-border">
          <span className="text-sm font-medium text-muted">Status:</span>
          <Badge status={propertyStatus} />
        </div>
      )}

      {apiError && (
        <div className="px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-600">
          {apiError}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <Controller
            name="descriptionHtml"
            control={control}
            render={({ field }) => (
              <RichTextEditor
                label="Description *"
                value={field.value ?? ''}
                onChange={field.onChange}
                error={errors.descriptionHtml?.message}
              />
            )}
          />
        </div>

        <Select
          id="houseType"
          label="House Type *"
          options={[
            { value: 'apartment', label: 'Apartment' },
            { value: 'house', label: 'House' },
            { value: 'single-room', label: 'Single Room' },
            { value: 'townhouse', label: 'Townhouse' },
          ]}
          placeholder="Select type"
          error={errors.houseType?.message}
          {...register('houseType')}
        />

        <Select
          id="listingFor"
          label="Listing For *"
          options={[
            { value: 'RENT', label: 'Rent' },
            { value: 'SALE', label: 'Sale' },
          ]}
          placeholder="Select purpose"
          error={errors.listingFor?.message}
          {...register('listingFor')}
        />

        <Input
          id="price"
          label="Price *"
          type="number"
          placeholder="e.g. 85000000"
          min={1}
          error={errors.price?.message}
          {...register('price', { valueAsNumber: true })}
        />

        <Input
          id="squareFootage"
          label="Square Footage"
          type="number"
          placeholder="e.g. 120"
          min={0}
          error={errors.squareFootage?.message}
          {...register('squareFootage', { valueAsNumber: true, setValueAs: (v) => (v === '' || isNaN(v) ? null : Number(v)) })}
        />

        <Input
          id="bedrooms"
          label="Bedrooms *"
          type="number"
          min={0}
          error={errors.bedrooms?.message}
          {...register('bedrooms', { valueAsNumber: true })}
        />

        <Input
          id="bathrooms"
          label="Bathrooms *"
          type="number"
          min={0}
          error={errors.bathrooms?.message}
          {...register('bathrooms', { valueAsNumber: true })}
        />

        <Input
          id="street"
          label="Street Address *"
          placeholder="12 Rue Didouche Mourad"
          error={errors.street?.message}
          {...register('street')}
        />

        <Input
          id="city"
          label="City *"
          placeholder="Algiers"
          error={errors.city?.message}
          {...register('city')}
        />

        <Input
          id="state"
          label="State / Province *"
          placeholder="Algiers"
          error={errors.state?.message}
          {...register('state')}
        />

        <Input
          id="zip"
          label="ZIP Code *"
          placeholder="16000"
          error={errors.zip?.message}
          {...register('zip')}
        />

        <Input
          id="listingAgentName"
          label="Listing Agent Name"
          readOnly
          disabled
          className="opacity-60 cursor-not-allowed"
          {...register('listingAgentName')}
        />

        <Input
          id="listingAgentPhone"
          label="Listing Agent Phone"
          type="tel"
          readOnly
          disabled
          className="opacity-60 cursor-not-allowed"
          {...register('listingAgentPhone')}
        />
      </div>

      <div>
        <p className="text-sm font-medium text-hs-text mb-2">Property Images</p>

        {existingImgs.length > 0 && (
          <div className="mb-3">
            <p className="text-xs text-muted mb-2">Existing images</p>
            <div className="flex flex-wrap gap-3">
              {existingImgs.map((img) => (
                <div key={img.imageId} className="relative w-24 h-24 rounded-lg overflow-hidden border border-border group">
                  <Image src={img.imageUrl} alt="Property image" fill className="object-cover" />
                  {img.primaryImage && (
                    <span className="absolute bottom-0 left-0 right-0 bg-primary/80 text-white text-[10px] text-center py-0.5">Primary</span>
                  )}
                  <button
                    type="button"
                    onClick={() => deleteExistingImage(img.imageId)}
                    disabled={deletingImageId === img.imageId}
                    className="absolute top-1 right-1 w-5 h-5 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50"
                    aria-label="Delete image"
                  >
                    <X size={11} className="text-white" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center gap-3">
          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
            className="sr-only"
          />

          {/* Select button */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploadStatus !== 'idle'}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-dashed border-border bg-surface text-sm text-muted hover:border-primary hover:text-primary hover:bg-primary/5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ImagePlus size={16} />
            Select Images
            {selectedFiles.length > 0 && (
              <span className="ml-1 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {selectedFiles.length}
              </span>
            )}
          </button>
        </div>

        {previewImages.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-3">
            {previewImages.map((src, i) => (
              <div key={i} className="relative w-24 h-24 rounded-lg overflow-hidden border border-border group">
                <Image src={src} alt={`Preview ${i + 1}`} fill className="object-cover" />
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  disabled={uploadStatus !== 'idle'}
                  className="absolute top-1 right-1 w-5 h-5 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50"
                  aria-label="Remove image"
                >
                  <X size={11} className="text-white" />
                </button>
              </div>
            ))}
          </div>
        )}

        {isEdit && selectedFiles.length > 0 && (
          <p className="text-xs text-muted mt-2">
            {selectedFiles.length} new image{selectedFiles.length > 1 ? 's' : ''} selected. Click "Save Changes" to upload them.
          </p>
        )}
      </div>

      <div className="flex gap-3">
        <Button type="submit" disabled={uploadStatus !== 'idle' || isSubmitting}>
          {uploadStatus === 'saving'
            ? 'Saving property...'
            : uploadStatus === 'uploading'
              ? `Uploading ${selectedFiles.length} image${selectedFiles.length > 1 ? 's' : ''}...`
              : isSubmitting
                ? 'Processing...'
                : isEdit ? 'Save Changes' : 'Submit Property'}
        </Button>
        <Button type="button" variant="secondary" onClick={() => router.back()} disabled={uploadStatus !== 'idle' || isSubmitting}>
          Cancel
        </Button>
      </div>
    </form>
  )
}
