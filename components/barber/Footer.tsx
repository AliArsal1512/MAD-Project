import { View, TouchableOpacity, Text } from 'react-native'
import { useRouter, usePathname } from 'expo-router'

export default function Footer() {
  const router = useRouter()
  const pathname = usePathname()

  const tabs = [
    { label: 'Appointments', path: '/Barber/Appointments', key: 'appointments' },
    { label: 'Settings', path: '/Barber/BarberSettings', key: 'settings' },
    { label: 'Profile', path: '/Barber/BarberProfile', key: 'profile' },
  ]

  return (
    <View className="flex-row justify-around items-center bg-white py-4 border-t border-gray-200">
      {tabs.map((tab) => {
        const isActive = pathname === tab.path

        return (
          <TouchableOpacity
            key={tab.key}
            onPress={() => router.push(tab.path as any)}
            className="items-center"
          >
            <Text className={`text-sm ${isActive ? 'text-black font-semibold' : 'text-gray-500'}`}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        )
      })}
    </View>
  )
}
