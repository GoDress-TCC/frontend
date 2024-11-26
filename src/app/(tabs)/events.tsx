import { View, Text, StyleSheet, Image, Modal } from 'react-native'
import React, { useState } from 'react'

import { useEvents } from '@/src/services/contexts/eventsContext';
import { globalColors, globalStyles } from '@/src/styles/global';
import MainHeader from '../components/headers/mainHeader';
import { router } from 'expo-router';
import EventsList from '../components/flatLists/eventsList';

export default function Events() {
  const { events } = useEvents();

  return (
    <View style={globalStyles.globalContainer}>
      <MainHeader title="Eventos" functionButtonTitle="Adicionar evento" functionButtonIcon="plus" functionButtonOnPress={() => router.navigate("/events/addEvent")} />

      {events.length === 0 ?
        <View style={globalStyles.message}>
          <Text>Você não possui eventos no momento</Text>
        </View>
        :
        <View style={globalStyles.flatListContainer}>
          <EventsList events={events} />
        </View>
      }

    </View>
  )
}

const styles = StyleSheet.create({

});