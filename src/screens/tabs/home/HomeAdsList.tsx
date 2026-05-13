// src/screens/tabs/home/HomeAdsList.tsx
import ListingCard from '@/src/components/ListingCard';
import React from 'react';
import { FlatList, View } from 'react-native';

export default function HomeAdsList() {
    const data = [
        {
            id: 1,
            title: "خانه بومگردی زیبا با امکانات کامل برای مسافران",
            image: "https://picsum.photos/200/150?1",
            location: "سیستان و بلوچستان، زاهدان، کاظم آباد",
            timeAgo: "5 ساعت پیش",
            rooms: "بدون اتاق",
            area: 1500,
            capacity: 4,
            rent: "۵۰۰,۰۰۰",
        },
        {
            id: 2,
            isAdminMessage: true,
            adminMessage: "همه استان‌ها | ۳۵۴ آگهی - این یک پیام پیش‌فرض جهت نمایش پیام سیستمی است",
        },
        {
            id: 3,
            title: "معرفی برند KTM و آشنایی با برند برتر KTM",
            image: "https://picsum.photos/200/150?2",
            location: "سیستان و بلوچستان، زاهدان، کاظم آباد",
            timeAgo: "۵ ساعت پیش",
        },
        {
            id: 4,
            title: "خانه ویلایی مدرن - ۴ خوابه در شیخ صدوق شمالی",
            image: "https://picsum.photos/200/150?3",
            location: "اصفهان، اصفهان، سیستان و بلوچستان",
            timeAgo: "لحظاتی پیش",
            rooms: "بدون اتاق",
            area: 1500,
            rent: "۵۰۰,۰۰۰ تومان",
        },
        {
            id: 5,
            title: "ماشین لباسشویی: ۸ کیلویی برند ال جی",
            image: "https://picsum.photos/200/150?4",
            location: "تهران",
            timeAgo: "۲ ساعت پیش",
        },
    ];

    return (
        <View style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
            <FlatList
                data={data}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <ListingCard
                        title={item.title}
                        image={item.image}
                        location={item.location}
                        timeAgo={item.timeAgo}
                        rooms={item.rooms}
                        area={item.area}
                        capacity={item.capacity}
                        rent={item.rent}
                        isAdminMessage={item.isAdminMessage}
                        adminMessage={item.adminMessage}
                    />
                )}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
}