import React from 'react';
import {
  View,
  Text,
  StatusBar,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { COLORS, icon, SIZES } from '../constant';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Transfer from './Transfer';
import Deposit from './Deposit';
import TopUp from './TopUp';
import Withdraw from './WithDrawal';
import { BarChart } from 'react-native-chart-kit';
import { useState } from 'react';
import moment from 'moment';

const HomeScreen = ({ navigation }) => {
  const [data, setData] = useState([
    { date: moment().format('LL'), amount: 500 },
    { date: moment().subtract(1, 'days').format('LL'), amount: 1000 },
    { date: moment().subtract(2, 'days').format('LL'), amount: 1500 },
    { date: moment().subtract(3, 'days').format('LL'), amount: 2000 },
    { date: moment().subtract(4, 'days').format('LL'), amount: 2500 },
  ]);

  const getDates = () => data.map((pair) => pair.date);
  const getAmounts = () => data.map((pair) => pair.amount);

  const groupBy = (array, key) => {
    xs.reduce((rv, x) => {
      (rv[x[key]] = rv[x[key]] || []).push(x);
      return rv;
    }, {});
  };

  const menuItems = [
    {
      icon: <FontAwesome name="download" size={25} color={COLORS.primary} />,
      name: 'Transfer',
      onPress: () => {
        navigation.navigate(Transfer);
      },
    },
    {
      icon: <FontAwesome name="file-text-o" size={25} color={COLORS.primary} />,
      name: 'Withdraw',
      onPress: () => {
        navigation.navigate(Withdraw);
      },
    },
    {
      icon: <FontAwesome FontAwesome name="mobile" size={35} color={COLORS.primary} />,
      name: 'Top Up',
      onPress: () => {
        navigation.navigate(TopUp);
      },
    },
    {
      icon: <FontAwesome name="money" size={25} color={COLORS.primary} />,
      name: 'Deposit',
      onPress: () => {
        navigation.navigate(Deposit);
      },
    },
  ];

  return (
    <View style={{ backgroundColor: COLORS.white, flex: 1 }}>
      <StatusBar backgroundColor={COLORS.white} barStyle="dark-content" />
      <ScrollView
        contentContainerStyle={{
          paddingTop: 3,
          paddingHorizontal: 15,
        }}
      >
        <View style={style.card}>
          <Text style={{ color: COLORS.white, fontSize: 20, paddingTop: 10 }}>Balance</Text>
          <View style={{ flexDirection: 'row' }}>
            <Text style={{ color: COLORS.white, fontSize: 16, paddingTop: 10, fontWeight: '900' }}>
              NGN
            </Text>
            <Text
              style={{
                color: COLORS.white,
                fontSize: 16,
                paddingTop: 10,
                paddingLeft: 5,
                fontWeight: '900',
              }}
            >
              0.00
            </Text>
          </View>
        </View>
        <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Features</Text>
        <View style={style.categoryContainer}>
          {menuItems.map(({ icon, name, onPress, backgroundColor }) => (
            <TouchableOpacity
              onPress={onPress}
              key={name}
              style={{ marginBottom: SIZES.padding * 2, width: 60, alignItems: 'center' }}
            >
              <View style={style.iconContainer}>{icon}</View>
              <Text style={style.itemText}>{name}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={{ flexDirection: 'row', padding: 15, alignItems: 'center' }}>
          <View
            style={{ height: 10, width: 10, backgroundColor: COLORS.primary, borderRadius: 10 }}
          ></View>
          <Text style={{ marginLeft: 8, flex: 1 }}>Income</Text>
          <View
            style={{ height: 10, width: 10, backgroundColor: COLORS.secondary, borderRadius: 10 }}
          ></View>
          <Text style={{ marginHorizontal: 10 }}>Expenses</Text>
        </View>
        <View style={{ flexDirection: 'row', marginBottom: 30 }}>
          <View style={style.expenseCard}>
            <View style={style.circleCard}>
              <FontAwesome name="arrow-down" size={13} color={COLORS.primary} />
            </View>
            <Text style={{ color: COLORS.white, marginBottom: 2, fontSize: 17 }}>Income</Text>
            <Text style={{ color: COLORS.white, fontWeight: 'bold', fontSize: 18 }}>
              Total value
            </Text>
          </View>
          <View style={style.expenseCard2}>
            <View style={style.circleCard}>
              <FontAwesome name="arrow-up" size={13} color={COLORS.secondary} />
            </View>
            <Text style={{ color: COLORS.white, marginBottom: 2, fontSize: 17 }}>Income</Text>
            <Text style={{ color: COLORS.white, fontWeight: 'bold', fontSize: 18 }}>
              Total value
            </Text>
          </View>
        </View>
        <View style={{ justifyContent: 'center' }}>
          <BarChart
            data={{
              labels: getDates(),
              datasets: [
                {
                  data: getAmounts(),
                },
              ],
            }}
            width={Dimensions.get('window').width - 25}
            height={220}
            yAxisLabel={'N'}
            yAxisInterval={1}
            chartConfig={{
              backgroundColor: '#1cc910',
              backgroundGradientFrom: '#eff3ff',
              backgroundGradientTo: '#efefef',
              decimalPlaces: null,
              color: (opacity = 1) => `rgba(255, 165, 0, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              style: {
                borderRadius: 10,
              },
              propsForDots: {
                r: '6',
                strokeWidth: '2',
                stroke: '#ffa726',
              },
            }}
            style={{
              marginVertical: 8,
              borderRadius: 16,
            }}
          />
        </View>
      </ScrollView>
    </View>
  );
};

const style = StyleSheet.create({
  card: {
    height: 100,
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    marginBottom: 20,
    elevation: 10,
    width: '100%',
    marginTop: 20,
    paddingHorizontal: 20,
  },
  itemText: {
    fontSize: 14,
    paddingVertical: 7,
    paddingTop: 5,
    fontWeight: '450',
  },
  categoryContainer: {
    marginTop: 20,
    marginHorizontal: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignSelf: 'stretch',
  },
  iconContainer: {
    height: 62,
    width: 70,
    backgroundColor: COLORS.white,
    elevation: 5,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  expenseCard: {
    height: 120,
    width: 150,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    marginHorizontal: 10,
  },
  expenseCard2: {
    height: 120,
    width: 150,
    backgroundColor: COLORS.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    marginHorizontal: 10,
  },
  circleCard: {
    height: 20,
    width: 20,
    borderRadius: 20,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    marginRight: 100,
  },
});

export default HomeScreen;
