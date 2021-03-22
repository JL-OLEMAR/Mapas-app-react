import React, { useContext, useEffect } from 'react'
import { SocketContext } from '../context/SocketContext'
import { useMapbox } from '../hooks/useMapbox'

const puntoInicial = {
  // Palacio de la Republica Peru
  // lng: -77.0297,
  // lat: -12.0449,

  // Barrio chino de Lima
  lng: -77.025769,
  lat: -12.050957,

  // Congreso de la Republica Peru
  // lng: -77.0253,
  // lat: -12.048,
  zoom: 16.5
}

export const MapaPage = () => {
  const { setRef, coords, nuevoMarcador$, movimientoMarcador$ } = useMapbox(puntoInicial)
  const { socket } = useContext(SocketContext)

  // Nuevo marcador
  useEffect(() => {
    nuevoMarcador$.subscribe(marcador => {
      socket.emit('marcador-nuevo', marcador)
    })
  }, [nuevoMarcador$, socket])

  // Movimiento de Marcador
  useEffect(() => {
    movimientoMarcador$.subscribe(marcador => {
      // console.log(marcador.id)
    })
  }, [movimientoMarcador$])

  // Escuchar nuevos marcadores
  useEffect(() => {
    socket.on('marcador-nuevo', (marcador) => {
      console.log(marcador)
    })
  }, [socket])

  return (
    <>
      <div className="info">
        Lng: {coords.lng} | Lat: {coords.lat} | zoom: {coords.zoom}
      </div>
      <div
        ref={setRef}
        className="mapContainer"
      />

    </>
  )
}
