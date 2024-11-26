import { View, Text, StyleSheet, Image, Modal } from 'react-native'
import React, { useState } from 'react'

import { useEvents } from '@/src/services/contexts/eventsContext';
import { globalColors, globalStyles } from '@/src/styles/global';
import MainHeader from '../components/headers/mainHeader';
import ModalScreen from '../components/modals/modalScreen';
import { router } from 'expo-router';

export default function Events() {
  const [openCreateEventModal, setOpenCreateEventModal] = useState(false);

  const { events } = useEvents();

  return (
    <View style={globalStyles.globalContainer}>
      <MainHeader title="Eventos" functionButtonTitle="Adicionar evento" functionButtonIcon="plus" functionButtonOnPress={() => router.navigate("/events/addEvent")} />

      {events.length === 0 ?
        <View style={globalStyles.message}>
          <Text>Você não possui eventos no momento</Text>
        </View>
        :
        <Text>Teste</Text>
      }

    </View>
  )
}

const styles = StyleSheet.create({

});