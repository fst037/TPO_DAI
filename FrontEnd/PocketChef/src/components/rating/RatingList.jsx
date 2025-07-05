import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import RatingCard from './RatingCard';
import colors from '../../theme/colors';
import { whoAmI } from '../../services/users';

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

  const [myId, setMyId] = useState(null);

  useEffect(() => {
    const fetchWhoAmI = async () => {
      try {
        const response = await whoAmI();
        if (response && response.data && response.data.id) {
          setMyId(response.data.id);          
        } else {
          setMyId(null);
        }
      } catch (error) {
        setMyId(null);
      }
    };
    fetchWhoAmI();
  }, [ratings]);

  return (
    <View>
      <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 8, marginBottom: 16 }}>
        {FILTERS.map(f => (
          <TouchableOpacity
            key={f.value}
            onPress={() => setFilter(f.value)}
            style={{
              backgroundColor: filter === f.value ? colors.secondary : colors.secondaryBackground,
              borderRadius: 20,
              paddingHorizontal: 14,
              paddingVertical: 7,
              borderWidth: filter === f.value ? 1.5 : 1,
              borderColor: filter === f.value ? colors.secondary : colors.mediumBorder,
              marginHorizontal: 2,
              minWidth: 38,
              alignItems: 'center',
            }}
          >
            <Text style={{ color: filter === f.value ? colors.primaryText : colors.secondaryText, fontWeight: 'bold' }}>{f.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
      {(!filteredRatings || filteredRatings.length === 0) ? (
        <View style={{ alignItems: 'center' }}>
          <Text style={{ color: colors.secondaryText, fontStyle: 'italic' }}>No hay reseñas.</Text>
        </View>
      ) : (
        <View style={{ gap: 12, paddingBottom: 8 }}>
          {filteredRatings.map(item => (
            <RatingCard key={item.id?.toString() || item.title || item.comment} rating={item} loggedInUser={myId}/>
          ))}
        </View>
      )}
    </View>
  );
}
