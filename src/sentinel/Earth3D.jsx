import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

const RADIUS = 1.35;

const LOCATIONS = [
  { name: "Minnesota", lat: 46.7296, lon: -94.6859, color: 0x00f5ff },
  { name: "California", lat: 36.7783, lon: -119.4179, color: 0x00f5ff },
  { name: "Arizona", lat: 34.0489, lon: -111.0937, color: 0x00f5ff },
  { name: "Odisha, India", lat: 20.9517, lon: 85.0985, color: 0xff55d4 },
];

const FEATURED_US = new Set([
  "arizona",
  "california",
  "minnesota",
]);

function getName(feature) {
  const p = feature?.properties || {};

  return String(
    p.name ||
    p.NAME ||
    p.NAME_1 ||
    p.ST_NM ||
    p.state ||
    p.State ||
    p.STATE_NAME ||
    p.shapeName ||
    p.NAME_EN ||
    p.NAME_LONG ||
    p.ADMIN ||
    p.admin ||
    "Unknown"
  );
}

function normalizeName(name) {
  return String(name).toLowerCase().trim();
}

function getPolygons(feature) {
  const geometry = feature?.geometry;

  if (!geometry) return [];

  if (geometry.type === "Polygon") {
    return [geometry.coordinates];
  }

  if (geometry.type === "MultiPolygon") {
    return geometry.coordinates;
  }

  return [];
}

function latLonToVector(lat, lon, radius = RADIUS) {
  const latitude = THREE.MathUtils.degToRad(lat);
  const longitude = THREE.MathUtils.degToRad(lon);

  return new THREE.Vector3(
    radius * Math.cos(latitude) * Math.sin(longitude),
    radius * Math.sin(latitude),
    radius * Math.cos(latitude) * Math.cos(longitude)
  );
}

function createBoundary(ring, material) {
  if (!ring || ring.length < 2) return [];

  const segments = [];
  let points = [];
  const step = Math.max(1, Math.floor(ring.length / 1200));

  function finish() {
    if (points.length >= 2) {
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      segments.push(new THREE.Line(geometry, material));
    }
    points = [];
  }

  for (let i = 0; i < ring.length; i += step) {
    const [lon, lat] = ring[i];

    if (!Number.isFinite(lon) || !Number.isFinite(lat)) continue;

    if (points.length) {
      const previous = points[points.length - 1];
      const next = latLonToVector(lat, lon, RADIUS + 0.008);

      // Avoid drawing a line across the globe at the date line.
      if (previous.distanceTo(next) > 0.35) {
        finish();
