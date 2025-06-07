import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import RatingCard from './RatingCard';

const FILTERS = [
  { label: 'Todos', value: 'all' },
  { label: '1★', value: 1 },
  { label: '2★', value: 2 },
  { label: '3★', value: 3 },
  { label: '4★', value: 4 },
  { label: '5★', value: 5 },
];

export default function RatingList({ ratings }) {
  const [filter, setFilter] = useState('all');

  const filteredRatings =
    filter === 'all'
      ? ratings
      : ratings?.filter(r => Math.round(r.rating) === filter);

  return (
    <View>
      <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 8, marginBottom: 16 }}>
        {FILTERS.map(f => (
          <TouchableOpacity
            key={f.value}
            onPress={() => setFilter(f.value)}
            style={{
              backgroundColor: filter === f.value && f.value !== 'all' ? '#FF9800' : '#eee',
              borderRadius: 20,
              paddingHorizontal: 14,
              paddingVertical: 7,
              borderWidth: filter === f.value ? 1.5 : 1,
              borderColor: filter === f.value && f.value !== 'all' ? '#FF9800' : '#ccc',
              marginHorizontal: 2,
              minWidth: 38,
              alignItems: 'center',
            }}
          >
            <Text style={{ color: filter === f.value && f.value !== 'all' ? '#fff' : '#888', fontWeight: 'bold' }}>{f.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
      {(!filteredRatings || filteredRatings.length === 0) ? (
        <View style={{ alignItems: 'center', marginTop: 12 }}>
          <Text style={{ color: '#aaa', fontStyle: 'italic' }}>No hay reseñas.</Text>
        </View>
      ) : (
        <View style={{ gap: 12, paddingBottom: 8 }}>
          {filteredRatings.map(item => (
            <RatingCard key={item.id?.toString() || item.title || item.comment} rating={item} />
          ))}
        </View>
      )}
    </View>
  );
}
