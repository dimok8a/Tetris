-- phpMyAdmin SQL Dump
-- version 5.0.2
-- https://www.phpmyadmin.net/
--
-- Хост: 127.0.0.1:3306
-- Время создания: Янв 14 2022 г., 13:09
-- Версия сервера: 10.3.22-MariaDB
-- Версия PHP: 7.1.33

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- База данных: `users`
--

-- --------------------------------------------------------

--
-- Структура таблицы `games`
--

CREATE TABLE `games` (
  `id` int(11) NOT NULL,
  `gamer1_data` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `gamer2_data` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `gamer1_id` int(11) NOT NULL,
  `gamer2_id` int(11) NOT NULL,
  `gamer1_status` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'connecting',
  `gamer2_status` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'connecting',
  `status` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'starting'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Дамп данных таблицы `games`
--

INSERT INTO `games` (`id`, `gamer1_data`, `gamer2_data`, `gamer1_id`, `gamer2_id`, `gamer1_status`, `gamer2_status`, `status`) VALUES
(52, '{\r\n        matrix: [[4,7,252,237,151],[4,6,252,237,151],[5,6,252,237,151],[5,5,252,237,151]], \r\n        score:0,\r\n        next:0,\r\n        pocket:7,\r\n        }', '{\r\n        matrix: [[5,6,64,86,96],[5,7,64,86,96],[6,6,64,86,96],[6,7,64,86,96]], \r\n        score:0,\r\n        next:4,\r\n        pocket:7,\r\n        }', 3, 1, 'ready', 'ready', 'stopped'),
(53, '{\r\n        matrix: [[4,7,252,237,151],[4,6,252,237,151],[5,6,252,237,151],[5,5,252,237,151]], \r\n        score:0,\r\n        next:3,\r\n        pocket:7,\r\n        }', '{\r\n        matrix: [[6,5,119,174,106],[6,6,119,174,106],[6,7,119,174,106],[7,6,119,174,106]], \r\n        score:0,\r\n        next:6,\r\n        pocket:7,\r\n        }', 1, 3, 'ready', 'ready', 'stopped');

-- --------------------------------------------------------

--
-- Структура таблицы `lobbies`
--

CREATE TABLE `lobbies` (
  `id` int(11) NOT NULL,
  `status` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'open',
  `creator_id` int(11) NOT NULL,
  `offer_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Дамп данных таблицы `lobbies`
--

INSERT INTO `lobbies` (`id`, `status`, `creator_id`, `offer_id`) VALUES
(179, 'close', 1, 3),
(180, 'accepted', 3, 1);

-- --------------------------------------------------------

--
-- Структура таблицы `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  `login` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  `hash` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(64) COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Дамп данных таблицы `users`
--

INSERT INTO `users` (`id`, `name`, `login`, `hash`, `token`) VALUES
(1, 'admin', 'admin', '0192023a7bbd73250516f069df18b500', 'f4486f7225406932d2789a7131ef0858'),
(2, 'vasya n', 'vasya', '4a2d247d0c05a4f798b0b03839d94cf0', ''),
(3, 'anna', 'anna731', '02b8c73bce341958f4bbcc4eec075215', '30dacc7224db4c8cc78d8819b01ffd77'),
(4, 'Антон', 'anton123', '88cc33df069eb70082af82f1f1ed4574', ''),
(5, '\" \' @ !; // ', '\" \' @ !; // ', '6001ecb149eede047aaa1b96286cb7ed', NULL),
(6, 'anonim', 'anonim2010', '27ace61dd0bd060c842758c9378ac6a0', '');

--
-- Индексы сохранённых таблиц
--

--
-- Индексы таблицы `games`
--
ALTER TABLE `games`
  ADD PRIMARY KEY (`id`);

--
-- Индексы таблицы `lobbies`
--
ALTER TABLE `lobbies`
  ADD PRIMARY KEY (`id`);

--
-- Индексы таблицы `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `login` (`login`);

--
-- AUTO_INCREMENT для сохранённых таблиц
--

--
-- AUTO_INCREMENT для таблицы `games`
--
ALTER TABLE `games`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=54;

--
-- AUTO_INCREMENT для таблицы `lobbies`
--
ALTER TABLE `lobbies`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=181;

--
-- AUTO_INCREMENT для таблицы `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
