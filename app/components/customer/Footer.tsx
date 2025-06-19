import { usePathname, useRouter } from 'expo-router'
import { Text, TouchableOpacity, View } from 'react-native'
import AppointmentsIcon from '../../../assets/icons/AppointmentsIcon'
import BookAppointmentIcon from '../../../assets/icons/BookAppointmentIcon'
import ProfileIcon from '../../../assets/icons/ProfileIcon'
import SettingsIcon from '../../../assets/icons/SettingsIcon'
import { useThemeContext } from '../../contexts/ThemeContext'

export default function Footer() {
  const router = useRouter()
  const pathname = usePathname()
  const { colors } = useThemeContext()

  const tabs = [
    { label: 'Search', path: '/Customer/BookAppointment', key: 'home', Icon: BookAppointmentIcon },
    { label: 'Appointments', path: '/Customer/MyAppointments', key: 'appointments', Icon: AppointmentsIcon },
    { label: 'Settings', path: '/Customer/CustomerSettings', key: 'settings', Icon: SettingsIcon },
    { label: 'Profile', path: '/Customer/CustomerProfile', key: 'profile', Icon: ProfileIcon },
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
        const { Icon } = tab

        return (
          <TouchableOpacity
            key={tab.key}
            onPress={() => router.push(tab.path as any)}
            style={{ alignItems: 'center' }}
          >
            <Icon
              width={24}
              height={24}
              fill={isActive ? colors.text : colors.textSecondary}
            />
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
