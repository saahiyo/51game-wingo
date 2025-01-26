Timer timer = new Timer();
// 1-Minute Period and Timer
timer.scheduleAtFixedRate(new TimerTask() {
    @Override
    public void run() {
        runOnUiThread(new Runnable() {
            @Override
            public void run() {
                Calendar calendar = Calendar.getInstance(TimeZone.getTimeZone("UTC"));

                int seconds = calendar.get(Calendar.SECOND);
                int remainingSeconds = 60 - seconds;
                int minutes = calendar.get(Calendar.MINUTE);
                int totalMinutes = calendar.get(Calendar.HOUR_OF_DAY) * 60 + minutes;

                // Update period number for 1-minute interval
                period1m.setText(new SimpleDateFormat("yyyyMMdd").format(calendar.getTime())
                        .concat("1000".concat(String.valueOf((long)(10001 + totalMinutes)))));

                // Update timer in format "  x x  :  x x" for 1-minute interval
                String formattedTime = String.format("   %02d  :  %02d", 0, remainingSeconds)
                        .replaceAll("(?<=\\d)(?=\\d)", " ");
                timer1m.setText(formattedTime);
            }
        });
    }
}, 0, 1000);