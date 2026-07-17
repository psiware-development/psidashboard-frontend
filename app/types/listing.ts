export interface ListMessages {
  fetchError: string
  createSuccess: string
  createError: string
  updateSuccess: string
  updateError: string
  deleteSuccess: string
  deleteError: string
}

export const DEFAULT_MESSAGES: ListMessages = {
  fetchError: 'No se pudo cargar el listado.',
  createSuccess: 'Elemento creado correctamente.',
  createError: 'Error al crear el elemento.',
  updateSuccess: 'Elemento actualizado correctamente.',
  updateError: 'Error al actualizar el elemento.',
  deleteSuccess: 'Elemento eliminado correctamente.',
  deleteError: 'Error al eliminar el elemento.'
}

export interface ListEndpoints {
  list: string
  /** Base path for single-item operations: GET /:id, PATCH /:id, DELETE /:id */
  item: string
  create?: string
}
