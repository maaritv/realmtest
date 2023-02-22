import React, { useState } from "react";
import { SafeAreaView, View, Text, TextInput, FlatList, Pressable } from "react-native";
import { Realm, createRealmContext } from '@realm/react'
//import Customer from './models/customer';

class Customer extends Realm.Object {
  _id!: Realm.BSON.ObjectId;
  name!: string;
  address!: string;
  // the Customer.generate() method creates Customer objects with fields with default values
  static generate(name: string, address: string) {
      return {
          _id: new Realm.BSON.ObjectId(),
          name,
          address,
      };
  }
  // To use a class as a Realm object type, define the object schema on the static property "schema".
  static schema = {
      name: 'Customer',
      primaryKey: '_id',
      properties: {
          _id: 'objectId',
          name: 'string',
          address: 'string',
      },
  };
}

const { RealmProvider, useRealm, useQuery } = createRealmContext({ schema: [Customer] })

export default function AppWrapper() {
  return (
    <RealmProvider><CustomerApp /></RealmProvider>
  )
}

function CustomerApp() {
  const realm = useRealm();
  const customers = useQuery(Customer);
  const [newName, setNewName] = useState("")
  const [newAddress, setNewAddress] = useState("")

  return (
    <SafeAreaView>
      <View style={{ flexDirection: 'row', justifyContent: 'center', margin: 10 }}>
        <TextInput
          value={newName}
          placeholder="Enter new customer name"
          onChangeText={setNewName}
        />
        <TextInput
          value={newAddress}
          placeholder="Enter new address"
          onChangeText={setNewAddress}
        />
        <Pressable
          onPress={() => {
            realm.write(() => {
              realm.create("Customer", Customer.generate(newName, newAddress));
            });
            setNewName("")
          }}><Text>➕</Text></Pressable>
      </View>
      <FlatList data={customers.sorted("name")} keyExtractor={(item) => item._id.toHexString()} renderItem={({ item }) => {
        return (
          <View style={{ flexDirection: 'row', justifyContent: 'center', margin: 10 }}>
            <Text style={{ paddingHorizontal: 10 }} >{item.name}</Text>
            <Pressable
              onPress={() => {
                realm.write(() => {
                  realm.delete(item)
                })
              }} ><Text>{"🗑️"}</Text></Pressable>
          </View>
        );
      }} ></FlatList>
    </SafeAreaView >
  );
}