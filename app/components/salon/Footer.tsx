import { usePathname, useRouter } from 'expo-router'
import { Text, TouchableOpacity, View } from 'react-native'
import { useThemeContext } from '../../contexts/ThemeContext'

export default function Footer() {
  const router = useRouter()
  const pathname = usePathname()
  const { colors } = useThemeContext()

  const tabs = [
    { label: 'Appointments', path: '/Salon/Appointments', key: 'appointments' },
    { label: 'Settings', path: '/Salon/Settings', key: 'settings' },
    { label: 'Profile', path: '/Salon/Profile', key: 'profile' }
  ]

  return (
    <View style={{
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'center',
      backgroundColor: colors.card,
      paddingVertical: 16,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    }}>
      {tabs.map((tab) => {
        const isActive = pathname === tab.path

        return (
          <TouchableOpacity
            key={tab.key}
            onPress={() => router.push(tab.path as any)}
            style={{ alignItems: 'center' }}
          >
            <Text style={{
              fontSize: 14,
              color: isActive ? colors.text : colors.textSecondary,
              fontWeight: isActive ? '600' : '400',
            }}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        )
      })}
    </View>
  )
}
