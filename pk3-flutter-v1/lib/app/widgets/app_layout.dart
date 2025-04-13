import 'package:flutter/material.dart';

class AppLayout extends StatelessWidget {
  final Widget child;
  final bool showAppBar;
  final bool showBottomNav;
  final String? title;

  const AppLayout({
    super.key,
    required this.child,
    this.showAppBar = true,
    this.showBottomNav = true,
    this.title,
  });

  @override
  Widget build(BuildContext context) {
    final String? currentRoute = ModalRoute.of(context)?.settings.name;

    // Define which index to highlight
    final int currentIndex = () {
      if (currentRoute == '/account') return 1;
      return 0;
    }();

    return Scaffold(
      appBar: showAppBar ? AppBar(title: Text(title ?? '')) : null,
      body: child,
      bottomNavigationBar:
          showBottomNav
              ? BottomNavigationBar(
                currentIndex: currentIndex,
                onTap: (index) {
                  final routes = ['/home', '/account'];
                  final targetRoute = routes[index];

                  if (currentRoute != targetRoute) {
                    Navigator.pushReplacementNamed(context, targetRoute);
                  }
                },
                items: const [
                  BottomNavigationBarItem(
                    icon: Icon(Icons.home),
                    label: 'Home',
                  ),
                  BottomNavigationBarItem(
                    icon: Icon(Icons.person),
                    label: 'Me',
                  ),
                ],
              )
              : null,
    );
  }
}
