plug_in_name = websocket

module_ldflags =
module_cflags  = 


COREPATH ?=../../core
include $(COREPATH)/plug-in/Makefile.app_module
