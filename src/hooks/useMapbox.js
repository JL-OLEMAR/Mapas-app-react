import { useCallback, useEffect, useRef, useState } from 'react'
import mapboxgl from 'mapbox-gl'
import { v4 } from 'uuid'
import { Subject } from 'rxjs'

mapboxgl.accessToken = 'pk.eyJ1Ijoib2xlbWFyMTk5NiIsImEiOiJja201a21senIwZjd5MnBydGUxMm03bTJoIn0.gkSIEUCMnuLi2FRdQh66WA'

export const useMapbox = (puntoInicial) => {
  // Referencia al DIV del mapa
  const mapaDiv = useRef()
  const setRef = useCallback((node) => {
    mapaDiv.current = node
  }, [])

  // Referecia los marcadores
  const marcadores = useRef({})

  // Observables de Rxjs
  const movimientoMarcador = useRef(new Subject())
  const nuevoMarcador = useRef(new Subject())

  // Mapa y coords
  const mapa = useRef()
  const [coords, setCoords] = useState(puntoInicial)

  // Funcion para agregar marcadores
  const agregarMarcador = useCallback((ev, id) => {
    const { lng, lat } = ev.lngLat || ev

    const marker = new mapboxgl.Marker()
    marker.id = id ?? v4()

    marker
      .setLngLat([lng, lat])
      .addTo(mapa.current)
      .setDraggable(true)

    // Asignamos al objeto de marcadores
    marcadores.current[marker.id] = marker

    if (!id) {
      nuevoMarcador.current.next({
        id: marker.id,
        lng,
        lat
      })
    }

    // escuchar movimientos del marcador
    marker.on('drag', ({ target }) => {
      const { id } = target
      const { lng, lat } = target.getLngLat()
      movimientoMarcador.current.next({ id, lng, lat })
    })
  }, [])

  // Funcion para actualizar la ubicacion del marcador
  const actualizarPosicion = useCallback(({ id, lng, lat }) => {
    marcadores.current[id].setLngLat([lng, lat])
  }, [])

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapaDiv.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [puntoInicial.lng, puntoInicial.lat],
      zoom: puntoInicial.zoom
    })

    mapa.current = map
  }, [puntoInicial])

  // Cuando se mueva el mapa
  useEffect(() => {
    mapa.current?.on('move', () => {
      const { lng, lat } = mapa.current.getCenter()
      setCoords({
        lng: lng.toFixed(4),
        lat: lat.toFixed(4),
        zoom: mapa.current.getZoom().toFixed(2)
      })
    })
  }, [])

  // Agregar marcadores cuando hago click
  useEffect(() => {
    mapa.current?.on('click', agregarMarcador)
  }, [agregarMarcador])

  return {
    agregarMarcador,
    actualizarPosicion,
    coords,
    marcadores,
    nuevoMarcador$: nuevoMarcador.current,
    movimientoMarcador$: movimientoMarcador.current,
    setRef
  }
}
