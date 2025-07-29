"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface Project {
  id: string
  title: string
  description: string
  category: string
  year: string
  location: string
  client: string
  area: string
  images: string[]
  coverImage: string
  status: "draft" | "published"
  createdAt: string
  updatedAt: string
}

interface ProjectModalProps {
  isOpen: boolean
  onClose: () => void
  project: Project | null
  onSave: (projectData: Partial<Project>) => void
}

export function ProjectModal({ isOpen, onClose, project, onSave }: ProjectModalProps) {
  const [title, setTitle] = useState(project?.title || "")
  const [description, setDescription] = useState(project?.description || "")
  const [category, setCategory] = useState(project?.category || "residencial")
  const [year, setYear] = useState(project?.year || "")
  const [location, setLocation] = useState(project?.location || "")
  const [client, setClient] = useState(project?.client || "")
  const [area, setArea] = useState(project?.area || "")
  const [coverImage, setCoverImage] = useState(project?.coverImage || "")

  useEffect(() => {
    if (project) {
      setTitle(project.title || "")
      setDescription(project.description || "")
      setCategory(project.category || "residencial")
      setYear(project.year || "")
      setLocation(project.location || "")
      setClient(project.client || "")
      setArea(project.area || "")
      setCoverImage(project.coverImage || "")
    } else {
      setTitle("")
      setDescription("")
      setCategory("residencial")
      setYear("")
      setLocation("")
      setClient("")
      setArea("")
      setCoverImage("")
    }
  }, [project])

  const categories = [
    "residencial",
    "comercial",
    "corporativo",
    "hospitalidad",
    "educacional",
    "industrial",
    "topografia",
    "sanitario",
  ]

  const handleSave = () => {
    const projectData = {
      title,
      description,
      category,
      year,
      location,
      client,
      area,
      coverImage,
    }
    onSave(projectData)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white border-gray-300 max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-gray-800">{project ? "Editar Proyecto" : "Nuevo Proyecto"}</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="title" className="text-gray-700">
              Título
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-gray-50 border-gray-300 text-gray-800"
            />
          </div>

          <div>
            <Label htmlFor="category" className="text-gray-700">
              Categoría
            </Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="w-full bg-gray-50 border-gray-300 text-gray-800">
                <SelectValue placeholder="Categoría" />
              </SelectTrigger>
              <SelectContent className="bg-white border-gray-300">
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="year" className="text-gray-700">
              Año
            </Label>
            <Input
              id="year"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="bg-gray-50 border-gray-300 text-gray-800"
            />
          </div>

          <div>
            <Label htmlFor="location" className="text-gray-700">
              Ubicación
            </Label>
            <Input
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="bg-gray-50 border-gray-300 text-gray-800"
            />
          </div>

          <div>
            <Label htmlFor="client" className="text-gray-700">
              Cliente
            </Label>
            <Input
              id="client"
              value={client}
              onChange={(e) => setClient(e.target.value)}
              className="bg-gray-50 border-gray-300 text-gray-800"
            />
          </div>

          <div>
            <Label htmlFor="area" className="text-gray-700">
              Área (m²)
            </Label>
            <Input
              id="area"
              value={area}
              onChange={(e) => setArea(e.target.value)}
              className="bg-gray-50 border-gray-300 text-gray-800"
            />
          </div>
        </div>

        <div className="mt-6">
          <Label htmlFor="description" className="text-gray-700">
            Descripción
          </Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="bg-gray-50 border-gray-300 text-gray-800 min-h-32"
          />
        </div>

        <div className="mt-6">
          <Label htmlFor="coverImage" className="text-gray-700">
            Imagen de Portada URL
          </Label>
          <Input
            id="coverImage"
            value={coverImage}
            onChange={(e) => setCoverImage(e.target.value)}
            className="bg-gray-50 border-gray-300 text-gray-800"
          />
        </div>

        <div className="flex justify-end mt-8 gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="border-gray-300 text-gray-700 bg-transparent"
          >
            Cancelar
          </Button>
          <Button type="button" onClick={handleSave} className="bg-gray-800 text-white hover:bg-gray-700">
            Guardar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
